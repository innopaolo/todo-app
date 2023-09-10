// Get the modal elements
const modal = document.getElementById("myModal");
const pModal = document.getElementById("projectModal");


// Close button element inside the modals
const closeBtn = document.querySelectorAll(".close");



// Event listener for closing the modal when clicking outside the modal content
window.addEventListener("click", (e) => {
    if (e.target === modal || e.target === pModal) {
        closeModal();
    }
});



 // Event listener for closing the modal when clicking the close button
 closeBtn.forEach(element => {
    element.addEventListener("click", closeModal);
});









export function openModal(id) {
    if (id === "openMyModal") {
        modal.style.display = "block";
    } else if (id === "addProject") {
        pModal.style.display = "block";
    }
}




export function closeModal() {
    modal.style.display = "none";
    pModal.style.display = "none"
}



export function removeFromArray(array, id) {
    const objIndex = array.findIndex(task => task.itemId == id);
    array.splice(objIndex, 1);
}