// write your code here 
document.addEventListener("DOMContentLoaded", () => {
  fetchRamens();
  handleNewRamenForm();
  handleEditForm();
  handleDelete();
});

const baseURL = "http://localhost:3000/ramens";
const ramenMenu = document.getElementById("ramen-menu");
const detailImg = document.querySelector("#ramen-detail img");
const detailName = document.querySelector("#ramen-detail .name");
const detailRestaurant = document.querySelector("#ramen-detail .restaurant");
const ratingDisplay = document.getElementById("rating-display");
const commentDisplay = document.getElementById("comment-display");

let currentRamen = null;

function fetchRamens() {
  fetch(baseURL)
    .then(res => res.json())
    .then(ramens => {
      ramens.forEach(displayRamenThumbnail);
      displayRamenDetails(ramens[0]);
    });
}

function displayRamenThumbnail(ramen) {
  const img = document.createElement("img");
  img.src = ramen.image;
  img.alt = ramen.name;
  img.addEventListener("click", () => displayRamenDetails(ramen));
  ramenMenu.appendChild(img);
}

function displayRamenDetails(ramen) {
  currentRamen = ramen;
  detailImg.src = ramen.image;
  detailName.textContent = ramen.name;
  detailRestaurant.textContent = ramen.restaurant;
  ratingDisplay.textContent = ramen.rating;
  commentDisplay.textContent = ramen.comment;
}

function handleNewRamenForm() {
  const form = document.getElementById("new-ramen");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const newRamen = {
      name: form.name.value,
      restaurant: form.restaurant.value,
      image: form.image.value,
      rating: form.rating.value,
      comment: form["new-comment"].value
    };

    // POST new ramen to server
    fetch(baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRamen)
    })
      .then(res => res.json())
      .then(ramen => displayRamenThumbnail(ramen));

    form.reset();
  });
}

function handleEditForm() {
  const form = document.getElementById("edit-ramen");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const updatedRating = form["new-rating"].value;
    const updatedComment = form["new-comment"].value;

    if (!currentRamen) return;

    // Update frontend
    ratingDisplay.textContent = updatedRating;
    commentDisplay.textContent = updatedComment;

    // PATCH to server
    fetch(`${baseURL}/${currentRamen.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: updatedRating,
        comment: updatedComment
      })
    });
  });
}

function handleDelete() {
  const deleteBtn = document.getElementById("delete-ramen");
  if (!deleteBtn) return;

  deleteBtn.addEventListener("click", () => {
    if (!currentRamen) return;

    // DELETE from server
    fetch(`${baseURL}/${currentRamen.id}`, {
      method: "DELETE"
    }).then(() => {
      // Remove image from DOM
      const ramenImages = document.querySelectorAll("#ramen-menu img");
      ramenImages.forEach(img => {
        if (img.alt === currentRamen.name) img.remove();
      });

      // Clear detail
      detailImg.src = "";
      detailName.textContent = "";
      detailRestaurant.textContent = "";
      ratingDisplay.textContent = "";
      commentDisplay.textContent = "";
    });
  });
}