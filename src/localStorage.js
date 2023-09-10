// Loads local storage data if available


import { appendToContainer, addModalInfoToTaskObject, todoListArray } from "./todoList.js";
import { projectsArray } from "./projects.js";
import { toggleTheme, darkTheme } from "./theme.js";


window.addEventListener("load", () => {
    initializeApp();
});










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
        if (todoListArray) {
            todoListArray.forEach(element => {
                appendToContainer(element.title, element.itemId);

                if (element.dueDate !== undefined) {
                    addModalInfoToTaskObject(element.itemId, element.description, element.dueDate);
                }
            });
        } 
    }
}



export function saveToLocalStorage(todos, projects, darkTheme) {
        
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



