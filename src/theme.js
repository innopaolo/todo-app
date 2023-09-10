// Toggle light and dark theme

import { todoListArray } from "./todoList";
import { projectsArray } from "./projects";
import { saveToLocalStorage } from "./localStorage";

const themeBtn = document.getElementById("theme-btn");
export const container = document.querySelector(".container");
export const formInput = document.querySelector(".form-input");
export const modalTxtarea = document.getElementById("description");
const modalContent = document.querySelectorAll(".modal-content");
const modalSubmitImage = document.querySelectorAll(".modal-image");
const taskInputs = document.querySelectorAll(".taskInput");
const squigglyArrow = document.getElementById("squiggly-arrow");

export let darkTheme = false;

document.addEventListener("DOMContentLoaded", () => {
    themeBtn.addEventListener("click", () => {
        darkTheme = !darkTheme;
        toggleTheme();
    });
});


export function updateProjectTasksTheme() {
    taskInputs.forEach(element => {
        element.classList.toggle("changeThemeInput", darkTheme);
    });
    const projectModalButtons = document.querySelectorAll(".prj-btn");
    projectModalButtons.forEach(element => {
        if (darkTheme) {
            element.style.color = "black";
        }
    });
}


export function toggleTheme() {
    saveToLocalStorage(todoListArray, projectsArray, darkTheme);

    updateProjectTasksTheme();

    // Default class "fa-moon" switches to "fa-sun" on toggle
    themeBtn.classList.toggle("fa-sun");

    if (themeBtn.classList.contains("fa-sun")) {

        themeBtn.style.backgroundColor = "#793b1b";
        themeBtn.style.color = "white";

        document.body.classList.add("changeThemeBody");
        container.classList.add("changeThemeContainer");
        formInput.classList.add("changeThemeInput");
        modalTxtarea.classList.add("changeThemeInput");
        
        modalContent.forEach(element => {
            element.classList.add("changeThemeModal");
        });
        taskInputs.forEach(element => {
            element.classList.add("changeThemeInput");
        });
        

        // White version of the ship's wheel button and squiggly arrow
        modalSubmitImage.forEach(element => {
            element.src = shipWheelLight;
        });
        squigglyArrow.src = squigglyArrowDownLight;

    } else {

        themeBtn.style.backgroundColor = "#e6d7a9";
        themeBtn.style.color = "#494a4b";

        document.body.classList.remove("changeThemeBody");
        container.classList.remove("changeThemeContainer");
        formInput.classList.remove("changeThemeInput");
        modalTxtarea.classList.remove("changeThemeInput");
        
        modalContent.forEach(element => {
            element.classList.remove("changeThemeModal");
        });
        taskInputs.forEach(element => {
            element.classList.remove("changeThemeInput");
        });

        // Black version of the ship's wheel button and squiggly arrow
        modalSubmitImage.forEach(element => {
            element.src = shipWheel;
        });
        squigglyArrow.src = squigglyArrowDown;
    }
}
