// Projects page


import { todoListArray } from "./todoList.js";
import { updateProjectTasksTheme, darkTheme, container } from "./theme.js";
import { saveToLocalStorage } from "./localStorage.js";
import { openModal, closeModal, removeFromArray } from "./utils.js";

const goToProjectPage = document.getElementById("projects-button-wrapper"); 
const projectContainer = container;
const footer = document.querySelector(".footer");
const addProjectCard = document.querySelector(".add-project-card");
const addTaskBtn = document.getElementById("addTaskBtn");
const projectModalForm = document.getElementById("project-modal-form");

export let projectsArray = [];
let removedChildren = [];

let isEditing = false;

// When top left folder icon is clicked
document.addEventListener("DOMContentLoaded", () => {
    goToProjectPage.addEventListener("click", () => {
        
        // Clear container by storing each childElement to array then removing after
        while (projectContainer.firstChild) {
            removedChildren.push(projectContainer.firstChild);
            projectContainer.removeChild(projectContainer.firstChild);
        } 

        // Create project "cards" container
        const cardsContainer = document.createElement("div");
        cardsContainer.classList.add("cards-container");
        
        // Create return to home button
        const returnBtn = document.createElement("button");
        returnBtn.setAttribute("id", "return-button-wrapper");
        returnBtn.innerHTML = "<div id='return' class='far fa-hand-point-left'></div>";

        projectContainer.appendChild(returnBtn);
        projectContainer.appendChild(cardsContainer);

        // Re-populate project page with project cards if any
        if(projectsArray) {
            for (let i = 0; i < projectsArray.length; i++) {
                
                const project = projectsArray[i];

                // Note: array have inexplicably undefined objects, presumably
                // coming from save local storage function.
                // This if block prevents any further loop on empty elements
                // [SOLVED! See commits on local storage] 
                if (project === undefined || project === null) {
                    break;
                }

                appendProjectsToCardsContainer(project.title, project.date, project.itemId);
            }
        }

        // Show non-project elements
        projectContainer.appendChild(footer);
        projectContainer.appendChild(addProjectCard);
        footer.style.display = "block";
        addProjectCard.style.display = "block";
    });
});





// Click events within project page
projectContainer.addEventListener("click", (e) => {

    const card = e.target.closest(".card-content");

    // If id is "return", go back to home container
    const divId = e.target.getAttribute("id");
    if (divId === "return") {

        const cardsContainer = document.querySelector(".cards-container");

        while (cardsContainer.firstChild) {
            // removedProjectsArray.push(cardsContainer.firstChild);
            cardsContainer.removeChild(cardsContainer.firstChild);
        }

        // Put back the original home elements saved in an array
        removedChildren.forEach(child => projectContainer.appendChild(child));

        // Remove return button
        const returnBtn = document.getElementById("return-button-wrapper");
        returnBtn.remove();

        // Hide elements
        footer.style.display = "none";
        addProjectCard.style.display = "none";
        cardsContainer.remove();

    } else if (divId && divId.includes("card_")) {

        if (!isEditing) {
            toggleCardLength(card, divId);
        }

    } else if (e.target.classList.contains("delete")) {

        if (!isEditing) {
            const idValue = card.getAttribute("id");
            removeFromArray(projectsArray, idValue);
            card.remove();      
            saveToLocalStorage(todoListArray, projectsArray, darkTheme);
        }

    } else if (e.target.classList.contains("edit")) {
        
        if (!isEditing) {
            isEditing = true;

            // Show tasks if not yet toggled by checking existence of a dynamically generated h3 
            const ID = card.getAttribute("id");

            const h3 = document.querySelector("h3");
            if (!h3) {
                toggleCardLength(card, ID);
            }

            // Select all editable content and replace with input
            const editable = card.querySelectorAll(".editable");
            editable.forEach(element => {
                editMode(element, card);
            })

            // Button that edits projects array and card content on submit
            const submitEdit = document.createElement("button");
            submitEdit.id = "submit-edit";
            
            // Validation from a dynamically generated form doesnt seem to work
            // submitEdit.setAttribute("form", "editForm");
            // submitEdit.setAttribute("type", "submit"); 
            // (See appendProjectsToCardContainer function)

            submitEdit.className = "button";
            submitEdit.innerHTML = "<span>Submit</span>";

            card.appendChild(submitEdit);

            submitEdit.addEventListener("click", (e) => {
                e.preventDefault();
                handleSubmitEdit(card, ID);
                saveToLocalStorage(todoListArray, projectsArray, darkTheme); 
            });
        }
    }
});


addProjectCard.addEventListener("click", (e) => {
    if (isEditing) {
        return;
    }
    const clickedElement = e.target.getAttribute("id");
    openModal(clickedElement);
});



// Button for new task input in projects modal
addTaskBtn.addEventListener("click", () => {
    addTaskInput();
    updateProjectTasksTheme();
});



// Form submission in modal
projectModalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const projectTitle = document.getElementById("title");
    const dueDate = document.getElementById("pDate");
    const taskInputs = document.querySelectorAll(".taskInput");
    const tasks = Array.from(taskInputs).map(input => input.value);
    const taskList = document.getElementById("taskList");

    // Give each project a timestamp id
    const itemId = "card_" + new Date().getTime().toString();

     // Create a new project instance
    const newProject = createProject(projectTitle.value, dueDate.value, tasks, itemId);

    // Save the new project
    projectsArray.push(newProject);

    appendProjectsToCardsContainer(projectTitle.value, dueDate.value, itemId);
    saveToLocalStorage(todoListArray, projectsArray, darkTheme);


    // Remove values and clear task list
    projectTitle.value = "";
    dueDate.value = "";

    while (taskList.firstChild) {
        taskList.firstChild.remove();
    }

    // Ensure there is at least one task input
    const firstTask = document.createElement("div");
    firstTask.className = "task";
    firstTask.innerHTML = '<input data-id="task_0" type="text" class="taskInput" placeholder="Task name" required>';

    taskList.appendChild(firstTask);


    closeModal();
});











// Factory function to create projects
function createProject(title, date, tasks, itemId) {
    return { title, date, tasks, itemId };
}




function appendProjectsToCardsContainer(projectTitle, dueDate, id) {
    const cardsContainer = document.querySelector(".cards-container");

    const newCard = document.createElement("div");
    newCard.className = "card-content";
    newCard.id = id;

    // Create DOM elements for the card content
    const title = document.createElement("h1");
    title.id = id;
    title.classList.add("editable");
    title.textContent = projectTitle;

    const subtitle = document.createElement("p");
    subtitle.id = id;
    subtitle.classList.add("editable", "edit-date");
    subtitle.innerHTML = `<span class="span-key">due:</span> ${dueDate}`;

    const removeBtn = document.createElement("span");
    removeBtn.classList.add("remove-btn", "delete");
    removeBtn.innerHTML = "<img class='delete' src='trash-can-solid.svg'>"; 

    const editProjectBtn = document.createElement("span");
    editProjectBtn.classList.add("edit-btn", "edit");
    editProjectBtn.innerHTML = "<img class='edit' src='pen-to-square-solid.svg'>"; 
    

    newCard.appendChild(title);
    newCard.appendChild(subtitle);
    newCard.appendChild(removeBtn);
    newCard.appendChild(editProjectBtn);


    // const form = document.createElement("form");
    // form.id = "editForm"; 
    // form.appendChild(newCard);
    // Referencing id doesnt work 
    // (See if-block that handles edit in projectsContainer click event)

    
    cardsContainer.appendChild(newCard);
}





function editMode (elementToEdit, parentElement) {
    const h1 = parentElement.querySelector("h1");
    const p = parentElement.querySelector("p");
    const ul = parentElement.querySelectorAll("li");


   if (elementToEdit.tagName === "H1") {
    const h1Input = document.createElement("input");
    h1Input.id = "h1";
    h1Input.className = "edit-input-visible";
    h1Input.required = true;
    h1Input.value = elementToEdit.textContent;

    parentElement.replaceChild(h1Input, h1);
   }

   if (elementToEdit.tagName === "P") {
    const pInput = document.createElement("input");
    pInput.id = "p";
    pInput.type = "date";
    pInput.className = "edit-input-visible";
    pInput.required = true;
    // pInput.value = elementToEdit.textContent 
    // Date inputs doesnt show for some reason *to be fixed

    parentElement.replaceChild(pInput, p);
   }

   if (elementToEdit.tagName === "LI") {
    const task = elementToEdit.textContent;

    const liInput = document.createElement("input");
    liInput.classList.add("edit-input-visible", "li");
    liInput.required = true;
    liInput.value = task;

    // Find the correct list item to replace
    let li = null; 
    ul.forEach(element => {
        if (element.textContent === task) {
            li = element;
        }     
    });

    const ulParent = parentElement.querySelector("ul");
    ulParent.replaceChild(liInput, li);
   }
}




function handleSubmitEdit(card, id) {
    const editedH1 = card.querySelector("#h1");
    const editedP = card.querySelector("#p");
    const editedUl = card.querySelectorAll(".li");
    const liArray = Array.from(editedUl).map(li => li.value);

    // Form validation
    const isEmpty = liArray.some(value => value === "");
    if (!editedH1.value || !editedP.value || isEmpty) {
        alert("Yarr! Better there be no empty fields!");
        return;
    }

    const foundProject = projectsArray.find(object => object.itemId === id);

    // Replace project properties with new values from user edit
    foundProject.title = editedH1.value;
    foundProject.date = editedP.value;
    foundProject.tasks = liArray;
    

    // Change back input elements to original structure but with new values
    const h1 = document.createElement("h1");
    h1.id = id;
    h1.classList.add("editable");
    h1.textContent = editedH1.value;
    card.replaceChild(h1, editedH1);

    const p = document.createElement("p");
    p.id = id;
    p.classList.add("editable", "edit-date");
    p.innerHTML = `<span class="span-key">due:</span> ${editedP.value}`;
    card.replaceChild(p, editedP);

    const editedUlParent = document.querySelector("ul");
    editedUl.forEach(input => {
        const li = document.createElement("li");
        li.id = id;
        li.classList.add("editable");
        li.textContent = input.value;
        
        editedUlParent.replaceChild(li, input);
    });

    // Collapse card to prevent duplicate elements every edit
    isEditing = false;
    toggleCardLength(card, id);
}   





function toggleCardLength(card, divId) {
    const taskh3 = card.querySelector("h3");

    if (!taskh3) {
        // Create tasks header
        const taskh3 = document.createElement("h3");
        taskh3.id = divId;
        taskh3.textContent = "Tasks:"

        card.appendChild(taskh3);

        // Find project object with same divID and grab its tasks
        const clickedProject = projectsArray.find(project => project.itemId === divId); 
        
        const list = document.createElement("ul");
        list.id = divId;
        list.className = "project-list";

        // Each task appended to a list
        clickedProject.tasks.forEach(element => {
            const li = document.createElement("li");
            li.id = divId;
            li.classList.add("editable");
            li.textContent = element;
            
            list.appendChild(li);
        });

        // Append list of tasks to card
        card.appendChild(list);

    } else {
        card.removeChild(taskh3);
        
        const list = document.querySelectorAll(".project-list");
        list.forEach(ul => {
            if (ul.id === divId) {
                ul.remove();
            }
        });

        // If edit button exists, remove it too
        const button = card.querySelector("button");
        if (button) button.remove();
    }     
}




function addTaskInput() {
    const id = "task_" + new Date().getTime().toString();

    const taskList = document.getElementById("taskList");
    const taskDiv = document.createElement("div");

    taskDiv.className = "task";
    taskDiv.innerHTML = `<input data-id="task_${id}" type="text" class="taskInput" placeholder="Task name" required><div class="button prj-btn removeTaskBtn"><span>remove</span></div>`;
    
    taskList.appendChild(taskDiv);


    // New remove button deletes the adjacent task on click
    const removeTaskBtn = document.querySelectorAll(".removeTaskBtn");
    
    removeTaskBtn.forEach(element => {
        element.addEventListener("click", (e) => {
            const div = e.target.closest(".task");
            div.remove();
        });

    });   
}


