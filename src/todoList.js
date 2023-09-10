// Initial home page


import { projectsArray } from "./projects.js";
import { saveToLocalStorage } from "./localStorage.js";
import { darkTheme, formInput, modalTxtarea } from "./theme.js";
import { openModal, closeModal, removeFromArray } from "./utils.js";



const form = document.querySelector(".form");
const mainPageInput = formInput;
const ul = document.querySelector(".todoList");
const modalForm = document.querySelector(".modal-form");
const modalInput = modalTxtarea;
const modalDate = document.getElementById("dueDate");

export let todoListArray = [];

// Unique ID counter for each list item generated
export let currentIDclicked;





// Submit form for initial task page
form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Remove trailing whitespace if any
        let title = mainPageInput.value.trim();
        let itemId = new Date().getMilliseconds().toString();

        appendToContainer(title, itemId);
        addToArray(title, itemId);
        saveToLocalStorage(todoListArray, projectsArray, darkTheme);


        mainPageInput.value = "";
    });




// Actions when modal submits
modalForm.addEventListener("submit", e => {
    e.preventDefault();

    // Remove trailing whitespace if any
    let description = modalInput.value.trim();
    let dueDate = modalDate.value;

    addModalInfoToTaskObject(currentIDclicked, description, dueDate);

    modalInput.value = "";
    modalDate.value = "";

    // If info boxes are open, close it (to show new submitted info on reopening)
    const infoBox = document.querySelectorAll(".info-box");
    infoBox.forEach(element => element.remove());

    saveToLocalStorage(todoListArray, projectsArray, darkTheme);

    closeModal();
});





// Click event for interacting with each list item
ul.addEventListener("click", e => {
    
    currentIDclicked = e.target.getAttribute("data-id");


    // No response if blank area clicked
    if (!currentIDclicked) return

    if (e.target.tagName === "LI") {
        toggleInfoBelowListItem(currentIDclicked, e.target);
    }
    
    if (e.target.tagName === "SPAN") {
        const className = e.target.getAttribute("class");
        openModal(className);
        showInfoAsPlaceholder(currentIDclicked);
        return;
    }

    if (e.target.tagName === "IMG") {
        const icon = e.target.getAttribute("id");
        if (icon === "flag") {

            // Target the parent div of flag then the div's sibling which is the text
            const closestDiv = e.target.closest("div");
            const closestSpan = closestDiv.previousElementSibling;

            // Targets the task and checks if there is already a generated priority flag
            const childSpanExists = closestSpan.querySelector("span");

            if (childSpanExists) {
                if (childSpanExists.style.color === "orangered") {
                    // If the color is already set to high priority, remove the span
                    childSpanExists.remove();
                } else {
                    // Otherwise, change the color to high priority
                    childSpanExists.style.color = "orangered";
                }
            } else {
                // If the span doesn't exist, create and append it
                const span = document.createElement("span");
                span.style.color = "#1a82a9"; // Initial color for medium priority
                span.classList.add("fas", "fa-exclamation-triangle");
                closestSpan.appendChild(span);
            }
        // If clicked icon is the delete button
        } else {
            const closestLi = e.target.closest("li");
            
            // Ensure sibling element is not a list item
            let infoBox = null;
            if (closestLi.nextElementSibling && closestLi.nextElementSibling.tagName !== "LI") {
                infoBox = closestLi.nextElementSibling;
            }    


            // If strikethrough class exists, proceed with deletion
            if (closestLi.classList.contains("readyForDeletion")) {

                removeFromContainer(currentIDclicked);
                removeFromArray(todoListArray, currentIDclicked);
                if(infoBox) infoBox.remove();
                saveToLocalStorage(todoListArray, projectsArray, darkTheme);

            } else {

                // Add class that adds text strikethrough
                closestLi.classList.add("readyForDeletion");
                if(infoBox) infoBox.classList.add("readyForDeletionInfo");

                // Remove strikethrough if not confirmed after 6 seconds
                setTimeout(() => {
                    closestLi.classList.remove("readyForDeletion");
                    if(infoBox) infoBox.classList.remove("readyForDeletionInfo");
                }, 6000);
            } 
        }
    }
    
});























export function appendToContainer(title, itemId) {
    const li = document.createElement("li");
    const div = document.createElement("div")

    // Create delete and flag icons + set data-id (used for click event)
    div.classList.add("icon-buttons");
    div.innerHTML = `<img id='flag' data-id='${itemId}' src='flag-solid.svg'><img id='trash'  class='tooltip-d' data-id='${itemId}' src='trash-can-solid.svg'>`;

    // Create a separate element for the task text
    const taskText = document.createElement("span");
    taskText.classList.add("openMyModal");
    taskText.textContent = title;

    // Append the div with the task text and icons to the li
    li.appendChild(taskText);
    li.appendChild(div);
    
    // Give both span element and its parent li an ID 
    li.setAttribute("data-id", itemId);
    taskText.setAttribute("data-id", itemId);

    ul.appendChild(li);
}



function addToArray(title, itemId) {
    todoListArray.push({title, itemId});
}



function findTaskObject(currentIDclicked) {
    return todoListArray.find(object => object.itemId == currentIDclicked);
}



export function addModalInfoToTaskObject(currentIDclicked, description, dueDate) {
    const taskObject = findTaskObject(currentIDclicked);

    if (taskObject) {
        taskObject.description = description;
        taskObject.dueDate = dueDate;
    } 
}



function showInfoAsPlaceholder(currentIDclicked) {
    const taskObject = findTaskObject(currentIDclicked);

    if (taskObject) {
        if (taskObject.description) {
            modalInput.value = taskObject.description;
        } else {
            modalInput.value = "";
        }
    }
}



function toggleInfoBelowListItem(currentIDclicked, listItem) {
    const taskObject = findTaskObject(currentIDclicked);
    const infoElementExists = listItem.nextElementSibling;


    if (infoElementExists && infoElementExists.classList.contains("info-box")) {
        infoElementExists.remove();
    } else {
        // Create a div element to hold the task information
        const div = document.createElement("div");
    
         // Iterate through the properties of the taskObject
        for (const key in taskObject) {
            let property = taskObject[key];

            // Create a paragraph element for each property
            const p = document.createElement("p");
            p.innerHTML = `<span class="span-key">${key}:</span> ${property}`;
            div.appendChild(p);
        }
    
        div.classList.add("info-box");
        listItem.insertAdjacentElement("afterend", div);
    }
}



function removeFromContainer(id) {
    const li = document.querySelector(`[data-id="${id}"]`)
    ul.removeChild(li);
}
