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
    const addProjectBtn = document.getElementById("projects-button-wrapper"); 
    const projectContainer = document.querySelector(".container");

    const removedChildren = [];

    addProjectBtn.addEventListener("click", () => {
        
        // Clear container by storing each childElement to array then removing after
        while (projectContainer.firstChild) {
            removedChildren.push(projectContainer.firstChild);
            projectContainer.removeChild(projectContainer.firstChild);
        } 
        
        // Create return button
        const returnBtn = document.createElement("div");
        returnBtn.setAttribute("id", "return-button-wrapper");
        returnBtn.innerHTML = "<div id='return' class='far fa-hand-point-left'></div>";

        projectContainer.appendChild(returnBtn);
    });



    // Click events within project page
    projectContainer.addEventListener("click", (e) => {

        // If id is return, go back to home
        const divId = e.target.getAttribute("id");

        if (divId === "return") {
            // "Going back home" means putting back the original home elements
            removedChildren.forEach(child => projectContainer.appendChild(child));
        }
    });












    function appendToContainer(title, itemId) {
        const li = document.createElement("li");
        const div = document.createElement("div")

        // Create delete and flag icons + set data-id (used for click event)
        div.classList.add("icon-buttons");
        div.innerHTML = `<img id='flag' data-id='${itemId}' src='flag-solid.svg'><img id='trash'  class='tooltip-d' data-id='${itemId}' src='trash-can-solid.svg'>`;

        // Create a separate element for the task text
        const taskText = document.createElement("span");
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











    // Toggle light and dark theme
    const themeBtn = document.getElementById("theme-btn");
    const container = document.querySelector(".container");
    const formInput = document.querySelector(".form-input");
    const modalContent = document.querySelector(".modal-content");
    const modalImage = document.getElementById("modal-image");
    const modalTxtarea = document.getElementById("description");


    themeBtn.addEventListener("click", () => {

        // Default class "fa-moon" switches to "fa-sun" on toggle
        themeBtn.classList.toggle("fa-sun");

        if (themeBtn.classList.contains("fa-sun")) {

            themeBtn.style.backgroundColor = "#793b1b";
            themeBtn.style.color = "white";

            document.body.classList.add("changeThemeBody");
            container.classList.add("changeThemeContainer");
            formInput.classList.add("changeThemeInput");
            modalContent.classList.add("changeThemeModal");
            modalTxtarea.classList.add("changeThemeInput");

            // Change to white version of the ship's wheel button
            modalImage.src = "ship-wheel-light.png";

        } else {

            themeBtn.style.backgroundColor = "#e6d7a9";
            themeBtn.style.color = "#494a4b";

            document.body.classList.remove("changeThemeBody");
            container.classList.remove("changeThemeContainer");
            formInput.classList.remove("changeThemeInput");
            modalContent.classList.remove("changeThemeModal");
            modalTxtarea.classList.remove("changeThemeInput");

            // Change to black version of the ship's wheel button
            modalImage.src = "ship-wheel.png";
        }
    });










    // Get the modal element
    const modal = document.getElementById("myModal");

    // Get the close button element inside the modal
    const closeBtn = document.querySelector(".close");

    // Function to open the modal
    function openModal() {
        modal.style.display = "block";
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = "none";
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
            openModal();
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
    closeBtn.addEventListener("click", closeModal);

    // Event listener for closing the modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });



})();