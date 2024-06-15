import settings from "../settings/settings";
import BlingPlayer from "./BlingPlayer";

const Toolkit = Java.type("java.awt.Toolkit");
const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor");

// I kinda hate this but it's fine I guess :/

class Route {
    constructor() {
        this.route = [];
        this.currentWp = 0;
        this.nearbyWaypoints = new Set();

        register('command', () => {
            this.loadRoute();
        }).setName('load');

        register('command', () => {
            this.route = [];
        }).setName('unload');

        register('command', () => {
            this.exportRoute();
            ChatLib.chat(`§d[BlingBling Addons] §fSuccessfully exported to clipboard!`);
        }).setName('export').setAliases(['e']);

        register('command', () => {
            this.loadRoute();
            this.route = this.route.map(obj => {
                const { x, z, options } = obj;
                return { x, y: 63, z, r: obj.r, g: obj.g, b: obj.b, options };
            });

            this.exportRoute();
            ChatLib.chat(`§d[BlingBling Addons] §f${this.route.length} y64 waypoints successfully exported to clipboard!`);
        }).setName('y64');

        register('command', (message) => {
            if (message.includes(' ')) {
                return;
            }
            const index = parseInt(message);
            if (!Number.isInteger(index)) {
                ChatLib.chat("§d[BlingBling Addons] §cInvalid index, must be a number.");
                return;
            }
        
            const adjustedIndex = index - 1; // decrement index by 1
            this.route.splice(adjustedIndex, 1);
            for (let i = adjustedIndex; i < this.route.length; i++) {
                this.route[i].options.name--;
            }
            ChatLib.chat(`§d[BlingBling Addons] §fWaypoint ${index} removed successfully!`);
        }).setName('ba rwp').setAliases(['rwp', 'barwp']);
        
        // TODO: get coords overload working
        register('command', (message) => {
            const [indexStr, ...coords] = message.split(' ');
            if (message.includes(' ')) {
                return;
            }
            const index = !Number.isInteger(parseInt(indexStr)) ? undefined : Math.max(0, Math.min(parseInt(indexStr) - 1, this.route.length)); // decrement index by 1 and clamp to route length
            if (index === undefined) {
                ChatLib.chat("§d[BlingBling Addons] §cInvalid index, must be a number.");
                return;
            }
            const x = Math.floor(Player.getX());
            const y = Math.floor(Player.getY()) - 1;
            const z = Math.floor(Player.getZ());
            const newWaypoint = {
                x,
                y,
                z,
                r: 0,
                g: 1,
                b: 0,
                options: { name: index + 1 }
            };
            this.route.splice(index, 0, newWaypoint); // insert the new waypoint at the index
            for (let i = index + 1; i < this.route.length; i++) { // update the names of all following waypoints (if needed)
                this.route[i].options.name++;
            }
            if (y > 63) {
                ChatLib.chat(`§d[BlingBling Addons] §fWaypoint ${index + 1} added successfully. §c(Outside MF!)`);
            } else {
                ChatLib.chat(`§d[BlingBling Addons] §fWaypoint ${index + 1} added successfully.`);
            }
        
        }).setName('ba swp').setAliases(['swp', 'ba swp', 'ba insert']);
        
        register('command', (message) => {
            this.currentWp = (this.currentWp + parseInt(message)) % this.route.length;
            ChatLib.chat(`§d[BlingBling Addons] §fwent forward ${message} waypoints`);
        }).setName('skip');
        
        register('command', (message) => {
            this.currentWp = (this.currentWp - parseInt(message) + this.route.length) % this.route.length; // modulo with length ensures we stay within bounds
            ChatLib.chat(`§d[BlingBling Addons] §fwent back ${message} waypoints`);
        }).setName('unskip');

        register("worldLoad", () => {
            this.currentWp = 0;
        });
        
        register('tick', () => {
            if (this.route.length > 0) {
                let distance = BlingPlayer.calcDist(this.route[this.currentWp].x + 0.5, this.route[this.currentWp].y, this.route[this.currentWp].z + 0.5);
        
                if (this.currentWp === 0) {
                    this.nearbyWaypoints = new Set();
                }

                if (distance <= 3 || (settings().cactusThing && this.nearbyWaypoints.has(this.currentWp))) {
                    this.currentWp = (this.currentWp + 1) % this.route.length;
                }
        
                if (settings().cactusThing && this.route.length > 3) {
                    this.route.forEach(waypoint => {
                        let wpDistance = BlingPlayer.calcDist(waypoint.x + 0.5, waypoint.y, waypoint + 0.5);
        
                        if (wpDistance < 3 && waypoint.options.name != this.currentWp) {
                            this.nearbyWaypoints.add(waypoint.options.name - 1);
                        }
                    });
                }
            }
        });
    }

    loadRoute() {
        this.currentWp = 0;
        const clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
        const clipboardData = clipboard.getData(DataFlavor.stringFlavor);
        try {
            this.route = JSON.parse(clipboardData);
    
            if (!this.route.every(waypoint => { return waypoint.options?.hasOwnProperty("name") })) {
                ChatLib.chat(`§d[BlingBling Addons] §fDetected DilloPro route. Converting to ColeWeight...`);
                this.route = this.route.map((obj, index) => {
                    if (!obj.options) {
                        obj.options = {};
                    }
                    obj.options.name = index + 1;
                    return obj;
                });
                this.exportRoute();
            }
            ChatLib.chat(`§d[BlingBling Addons] §fRoute loaded!`);
        } catch (e) {
            if (!(e instanceof SyntaxError)) {
                console.log(e);
            }
            ChatLib.chat("§d[BlingBling Addons] §fCouldn't load route");
        }
    }
    
    exportRoute() {
        ChatLib.command(`ct copy ${JSON.stringify(this.route)}`, true);
    }

    getRoute() {
        return this.route;
    }

    getCurrentWp() {
        return this.currentWp;
    }
}

export default new Route();