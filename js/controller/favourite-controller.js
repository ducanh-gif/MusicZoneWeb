import * as favouriteService from "../services/favourite-service.js";
import * as profileService from "../services/profile-service.js";
import { user } from "../config/check_session.js";

async function renderFavourites() {
  const playlistList = document.querySelector(".playlist-list");
  if (!user) {
    playlistList.innerHTML = "<p>Hãy đăng nhập để xem playlist</p>";
  } else {
    const favouriteIds = await profileService.getFavouriteByUser(user.email);
    if (!favouriteIds || favouriteIds.length === 0) {
      console.log("No favourites found for user.");
      return;
    }
    const favourites = await favouriteService.getFavouritesById(favouriteIds);
    console.log(favourites);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderFavourites();
});
