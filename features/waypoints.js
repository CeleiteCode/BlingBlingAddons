import settings from "../settings/settings";
import BlingPlayer from "../util/BlingPlayer";
import Route from "../util/Route";
import { drawTrace, drawText, drawDistText, drawBlock, drawBlockFill, drawBlockConnection } from "../util/render";

register('renderWorld', () => {
    if (Route.getRoute().length > 0) {
        if (settings().waypoint) {
            for (let i = 0; i < Route.getRoute().length; i++) {
                if (settings().waypointExtraLine) {
                    drawBlockConnection(Route.getRoute()[i], Route.getRoute()[(i + 1) % Route.getRoute().length], settings().waypointLineColor);
                }
                if (settings().waypointFill) {
                    drawBlockFill(Route.getRoute()[i], settings().waypointFillColor);
                }
                if (settings().waypointOutline) {
                    drawBlock(Route.getRoute()[i], settings().waypointOutlineColor);
                }
                drawText(Route.getRoute()[i].options.name, Route.getRoute()[i], settings().waypointTextColor);
            }
        } else {
            const nextWp = (currentWp + 1 + Route.getRoute().length) % Route.getRoute().length;
            const previousWp = (currentWp - 1 + Route.getRoute().length) % Route.getRoute().length;
            if (settings().waypointExtraLine) {
                drawBlockConnection(Route.getRoute()[previousWp], Route.getRoute()[currentWp], settings().waypointLineColor);
                drawBlockConnection(Route.getRoute()[currentWp], Route.getRoute()[nextWp], settings().waypointLineColor);
            }
            if (settings().waypointFill) {
                drawBlockFill(Route.getRoute()[nextWp], settings().waypointFillColor);
                drawBlockFill(Route.getRoute()[currentWp], settings().waypointFillColor);
                drawBlockFill(Route.getRoute()[previousWp], settings().waypointFillColor);
            }
            if (settings().waypointOutline) {
                drawBlock(Route.getRoute()[nextWp], settings().waypointOutlineColor);
                drawBlock(Route.getRoute()[currentWp], settings().waypointOutlineColor);
                drawBlock(Route.getRoute()[previousWp], settings().waypointOutlineColor);
            }

            if (settings().orderedLine) {
                drawTrace(Route.getRoute()[currentWp], settings().orderedLineColor);
            }

            drawText(Route.getRoute()[nextWp].options.name, Route.getRoute()[nextWp], settings().waypointTextColor);
            drawText(Route.getRoute()[currentWp].options.name, Route.getRoute()[currentWp], settings().waypointTextColor);
            drawText(Route.getRoute()[previousWp].options.name, Route.getRoute()[previousWp], settings().waypointTextColor);
        }

        if (Client.getKeyBindFromDescription("Draw line to current Waypoint").isKeyDown()) {
            drawTrace(Route.getRoute()[currentWp], settings().orderedLineColor);
            drawDistText(Math.round(BlingPlayer.calcDist(Route.getRoute()[currentWp].x + 0.5, Route.getRoute()[currentWp].y, Route.getRoute()[currentWp].z + 0.5)) + "m", Route.getRoute()[currentWp], settings().waypointTextColor);
        }
    }
})