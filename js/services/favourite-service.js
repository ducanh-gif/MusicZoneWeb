import * as db from "../config/db.js";
import * as model from "../config/model.js";

export async function getFavouritesById(Ids) {
    try {
        const favourites = await Promise.all(
            Ids.map(id => db.getDbById("favourites", id, model.favouriteConverter))
        );
        return favourites;
    } catch (error) {
        console.log("Error fetching favourites:", error);
        return [];
    }}