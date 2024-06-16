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
            const nextWp = (Route.getCurrentWp() + 1 + Route.getRoute().length) % Route.getRoute().length;
            const previousWp = (Route.getCurrentWp() - 1 + Route.getRoute().length) % Route.getRoute().length;
            if (settings().waypointExtraLine) {
                drawBlockConnection(Route.getRoute()[previousWp], Route.getRoute()[Route.getCurrentWp()], settings().waypointLineColor);
                drawBlockConnection(Route.getRoute()[Route.getCurrentWp()], Route.getRoute()[nextWp], settings().waypointLineColor);
            }
            if (settings().waypointFill) {
                drawBlockFill(Route.getRoute()[nextWp], settings().waypointFillColor);
                drawBlockFill(Route.getRoute()[Route.getCurrentWp()], settings().waypointFillColor);
                drawBlockFill(Route.getRoute()[previousWp], settings().waypointFillColor);
            }
            if (settings().waypointOutline) {
                drawBlock(Route.getRoute()[nextWp], settings().waypointOutlineColor);
                drawBlock(Route.getRoute()[Route.getCurrentWp()], settings().waypointOutlineColor);
                drawBlock(Route.getRoute()[previousWp], settings().waypointOutlineColor);
            }

            if (settings().orderedLine) {
                drawTrace(Route.getRoute()[Route.getCurrentWp()], settings().orderedLineColor);
            }

            drawText(Route.getRoute()[nextWp].options.name, Route.getRoute()[nextWp], settings().waypointTextColor);
            drawText(Route.getRoute()[Route.getCurrentWp()].options.name, Route.getRoute()[Route.getCurrentWp()], settings().waypointTextColor);
            drawText(Route.getRoute()[previousWp].options.name, Route.getRoute()[previousWp], settings().waypointTextColor);
        }

        if (Client.getKeyBindFromDescription("Draw line to current Waypoint").isKeyDown()) {
            drawTrace(Route.getRoute()[Route.getCurrentWp()], settings().orderedLineColor);
            drawDistText(Math.round(BlingPlayer.calcDist(Route.getRoute()[Route.getCurrentWp()].x + 0.5, Route.getRoute()[Route.getCurrentWp()].y, Route.getRoute()[Route.getCurrentWp()].z + 0.5)) + "m", Route.getRoute()[Route.getCurrentWp()], settings().waypointTextColor);
        }
    }
})