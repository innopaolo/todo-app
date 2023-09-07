(() => {
    // Global variables
    let todoListArray = [];
    const form = document.querySelector(".form");
    const input = document.querySelector(".form-input");
    const ul = document.querySelector(".todoList");








    // Unique ID counter for each list item generated
    let taskId = 1 
    let currentIDclicked;

    // Submit form for initial task page
    form.addEventListener("submit", e => {
        e.preventDefault();

        // Remove trailing whitespace if any
        let title = input.value.trim();
        let itemId = taskId;

        appendToContainer(title, itemId);
        addToArray(title, itemId);
        saveToLocalStorage(todoListArray, projectsArray);


        taskId++
        input.value = "";
    });















    // When modal submits
    const modalForm = document.querySelector(".modal-form");
    const modalInput = document.getElementById("description");
    const modalDate = document.getElementById("dueDate");

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

        saveToLocalStorage(todoListArray, projectsArray);

        closeModal();
    });











    // Create new project page
    // Create new project page
    // Create new project page
    // Create new project page
    const goToProjectPage = document.getElementById("projects-button-wrapper"); 
    const projectContainer = document.querySelector(".container");
    const footer = document.querySelector(".footer");
    const addProjectCard = document.querySelector(".add-project-card");

    let removedChildren = [];
    // let removedProjectsArray = [];

    goToProjectPage.addEventListener("click", () => {
        
        // Clear container by storing each childElement to array then removing after
        while (projectContainer.firstChild) {
            removedChildren.push(projectContainer.firstChild);
            projectContainer.removeChild(projectContainer.firstChild);
        } 

        // Create project cards container
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
                console.log(project);
                console.log(projectsArray.length);

                // Note: array have inexplicably undefined objects, presumably
                // coming from save local storage function.
                // This if block prevents any further loop on undefined elements 
                if (project === undefined) {
                    break;
                }

                appendProjectsToCardsContainer(project.title, project.date, project.itemId);
            }
        }
        // removedProjectsArray.forEach(project => cardsContainer.appendChild(project));

        // Show non-project elements
        projectContainer.appendChild(footer);
        projectContainer.appendChild(addProjectCard);
        footer.style.display = "block";
        addProjectCard.style.display = "block";

    });


    let isEditing = false;


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

            // "Going back home" means putting back the original home elements
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
                console.log(projectsArray);
                saveToLocalStorage(todoListArray, projectsArray);
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
                
                // submitEdit.setAttribute("form", "editForm");
                // submitEdit.setAttribute("type", "submit"); // Form validation doesnt work

                submitEdit.className = "button";
                submitEdit.innerHTML = "<span>Submit</span>";

                card.appendChild(submitEdit);

                submitEdit.addEventListener("click", (e) => {
                    e.preventDefault();
                    handleSubmitEdit(card, ID);
                    saveToLocalStorage(todoListArray, projectsArray); 
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
    })












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
        // pInput.value = elementToEdit.textContent // Doesnt work - to be fixed*

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

        // (???) Wrap newCard in a form for when edit mode is activated
        // const form = document.createElement("form");
        // form.id = "editForm"; // Form validation through id reference doesnt work
        // form.appendChild(newCard);

        
        cardsContainer.appendChild(newCard);
    }



    function appendToContainer(title, itemId) {
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

    function addModalInfoToTaskObject(currentIDclicked, description, dueDate) {
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

    function removeFromArray(array, id) {
        const objIndex = array.findIndex(task => task.itemId == id);
        array.splice(objIndex, 1);
    }

    // Factory function to create projects
    // Factory function to create projects
    // Factory function to create projects
    // Factory function to create projects
    function createProject(title, date, tasks, itemId) {
        return { title, date, tasks, itemId };
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







    // Event listener for adding a new task
    const addTaskBtn = document.getElementById("addTaskBtn");
    addTaskBtn.addEventListener("click", () => {
        addTaskInput();
        updateProjectTasksTheme();
    });

    // Event listener for form submission
    const projectModalForm = document.getElementById("project-modal-form");
    let projectsArray = [];

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
        console.log(projectsArray);

        appendProjectsToCardsContainer(projectTitle.value, dueDate.value, itemId);
        saveToLocalStorage(todoListArray, projectsArray);


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











    // Toggle light and dark theme
    const themeBtn = document.getElementById("theme-btn");
    const container = document.querySelector(".container");
    const formInput = document.querySelector(".form-input");
    const modalTxtarea = document.getElementById("description");
    const modalContent = document.querySelectorAll(".modal-content");
    const modalSubmitImage = document.querySelectorAll(".modal-image");
    const taskInputs = document.querySelectorAll(".taskInput");
    const squigglyArrow = document.getElementById("squiggly-arrow");

    let darkTheme = false;


    themeBtn.addEventListener("click", () => {
        darkTheme = !darkTheme;
        toggleTheme();
    });


    function updateProjectTasksTheme() {
        const taskInputs = document.querySelectorAll(".taskInput");
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


    function toggleTheme() {
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
                element.src = "ship-wheel-light.png";
            });
            squigglyArrow.src = "squiggly-arrow-light.png";

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
                element.src = "ship-wheel.png";
            });
            squigglyArrow.src = "squiggly-arrow.png";
        }
    }











    // Get the modal element
    const modal = document.getElementById("myModal");
    const pModal = document.getElementById("projectModal");

    // Get the close button element inside the modal
    const closeBtn = document.querySelectorAll(".close");

    // Function to open the modal
    function openModal(id) {
        if (id === "openMyModal") {
            modal.style.display = "block";
        } else if (id === "addProject") {
            pModal.style.display = "block";
        }
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = "none";
        pModal.style.display = "none"
    }

    // Event Listener for interacting with each list item
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
                    span.style.fontWeight = "900";
                    span.style.display = "inline";
                    span.textContent = "⚠️";
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
                    saveToLocalStorage(todoListArray, projectsArray);

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



    // Event listener for closing the modal when clicking the close button
    closeBtn.forEach(element => {
        element.addEventListener("click", closeModal);
    });

    // Event listener for closing the modal when clicking outside the modal content
    window.addEventListener("click", (e) => {
        if (e.target === modal || e.target === pModal) {
            closeModal();
        }
    });





    function saveToLocalStorage(todos, projects, darkTheme) {
        const data = {
                todoListArray: todos,
                projectsArray: projects,
                darkTheme: darkTheme,
        };

        localStorage.setItem("todoAppData", JSON.stringify(data));
    }
    
    function loadFromLocalStorage() {
        
        // Error handling to ensure app doesnt crash if data is corrupted or empty
        try {
            const data = localStorage.getItem("todoAppData");

            if (data) {
                const parsedData = JSON.parse(data);
                return parsedData;
            }

        } catch (error) {
            console.error("Error loading data from local storage:", error);
        }
        return null;
    }

    // Function to initialize your web app with loaded data
    function initializeApp() {
        const savedData = loadFromLocalStorage();

        if(savedData) {
            todoListArray = savedData.todoListArray;
            projectsArray = savedData.projectsArray;
            darkTheme = savedData.darkTheme;

            // Load last used theme
            if (darkTheme) {
                toggleTheme();
            }

            // Load saved data for "today" tasks container 
            appendToContainer(todoListArray.title, todoListArray.itemId);
            addToArray(todoListArray.title, todoListArray.itemId);
            addModalInfoToTaskObject(todoListArray.itemId, todoListArray.description, todoListArray.dueDate);

            // Load saved data for projects container
            projectsArray.push(projectsArray.title, projectsArray.date, projectsArray.tasks, projectsArray.itemId);
        }
    }

    window.addEventListener("load", () => {
        initializeApp();
    });


})();