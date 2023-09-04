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

    const removedChildren = [];
    const removedProjectsArray = [];

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


        // Re-populate project page with project cards if any
        removedProjectsArray.forEach(project => cardsContainer.appendChild(project));

        // Show non-project elements
        projectContainer.appendChild(footer);
        projectContainer.appendChild(addProjectCard);
        projectContainer.appendChild(cardsContainer);
        footer.style.display = "block";
        addProjectCard.style.display = "block";

    });





    // Click events within project page
    projectContainer.addEventListener("click", (e) => {

        // If id is "return", go back to home container
        const divId = e.target.getAttribute("id");
        if (divId === "return") {

            const cardsContainer = document.querySelector(".cards-container");

            while (cardsContainer.firstChild) {
                removedProjectsArray.push(cardsContainer.firstChild);
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
            console.log(divId);
        }
    });


    addProjectCard.addEventListener("click", (e) => {
        const clickedElement = e.target.getAttribute("id");
        openModal(clickedElement);
    })












    function appendProjectsToCardsContainer(projectTitle, dueDate) {
        const cardsContainer = document.querySelector(".cards-container");
        const newCard = document.createElement("div");
        newCard.className = "card-content";

        // Give each card a timestamp id
        const id = "card_" + new Date().getTime().toString();
        newCard.id = id;

        // Create DOM elements for the card content
        const title = document.createElement("h1");
        title.textContent = projectTitle;

        const subtitle = document.createElement("p");
        subtitle.textContent = dueDate;


        const removeBtn = document.createElement("span");
        removeBtn.className = "remove-btn";
        removeBtn.id = id
        removeBtn.innerHTML = "<img src='trash-can-solid.svg'>"; 
        
        newCard.appendChild(title);
        newCard.appendChild(subtitle);
        newCard.appendChild(removeBtn);

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
        console.log(todoListArray);
    }

    function findTaskObject(currentIDclicked) {
        return todoListArray.find(object => object.itemId == currentIDclicked);
    }

    function addModalInfoToTaskObject(currentIDclicked, description, dueDate) {
        const taskObject = findTaskObject(currentIDclicked);

        if (taskObject) {
            taskObject.description = description;
            taskObject.dueDate = dueDate;
            console.log(taskObject);
        } 
    }

    function showInfoAsPlaceholder(currentIDclicked) {
        const taskObject = findTaskObject(currentIDclicked);

        if (taskObject) {
            if (taskObject.description) {
                modalInput.value = taskObject.description;
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
                p.innerHTML = `<span style="color: #eec384;">${key}:</span> ${property}`;
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

    function removeFromArray(id) {
        const taskIndex = todoListArray.findIndex(task => task.itemId == id);
        todoListArray.splice(taskIndex, 1);
        console.log(todoListArray);
    }

    // Factory function to create projects
    // Factory function to create projects
    // Factory function to create projects
    // Factory function to create projects
    function createProject(title, date, tasks) {
        return { title, date, tasks };
    }

    function addTaskInput() {
        const id = "task_" + new Date().getTime().toString();

        const taskList = document.getElementById("taskList");
        const taskDiv = document.createElement("div");

        taskDiv.className = "task";
        taskDiv.innerHTML = `<input data-id="${id}" type="text" class="taskInput" placeholder="Task name"><div class="button prj-btn removeTaskBtn"><span>remove</span></div>`;
        
        taskList.appendChild(taskDiv);


        // New remove buttons deletes the adjacent task on click
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
        updateTheme();
    });

    // Event listener for form submission
    const projectModalForm = document.getElementById("project-modal-form");
    const projectsArray = [];

    projectModalForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get form data
        const projectTitle = document.getElementById("title");
        const dueDate = document.getElementById("pDate");
        const taskInputs = document.querySelectorAll(".taskInput");
        const tasks = Array.from(taskInputs).map(input => input.value);
        const removeTaskBtn = document.querySelectorAll(".removeTaskBtn");

         // Create a new project instance
        const newProject = createProject(projectTitle.value, dueDate.value, tasks);

        // Save the new project
        projectsArray.push(newProject);

        appendProjectsToCardsContainer(projectTitle.value, dueDate.value);
        console.log(projectsArray);



        // Remove values and clean task list
        projectTitle.value = "";
        dueDate.value = "";

        let counter = taskInputs.length;
        taskInputs.forEach(element => {  
            // Leave one input bar
            if (counter > 1) {
                element.remove();
                counter--;
            }
            element.value = "";
        });
        let counter2 = removeTaskBtn.length;
        removeTaskBtn.forEach(element => {
            // Leave one button
            if (counter2 > 1) {
                element.remove();
                counter2--;
            }
        });



        closeModal();
    });











    // Toggle light and dark theme
    function updateTheme() {
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

        updateTheme();

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
            console.log(taskInputs);
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
    });










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
                const infoBox = closestLi.nextElementSibling;

                // Add a strikethrough but require two taps to delete
                if (closestLi.classList.contains("readyForDeletion")) {

                    removeFromContainer(currentIDclicked);
                    removeFromArray(currentIDclicked);
                    if(infoBox) infoBox.remove();

                } else {

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


})();