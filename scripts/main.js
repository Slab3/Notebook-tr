const search = document.getElementById("search");
const newItem = document.getElementById("addItem");
const notesBlock = document.getElementById("notes");
let counter = 0;
// создать class note, и в него записать все данные о карточке , а потом его можно сохранить целиком в localstorage
let notes = {};

class Item {
    status = false;
    body = "";

    constructor(body) {
        this.body = body;
    }
}

class Note {
    title = "";
    items = [];

    search = (value) => {

    }
}

newItem.addEventListener("click", function() {
    counter++;
    notes[counter] = new Note();
    createNote();
});


function createNote() {
    let li = document.createElement("li");
    li.classList.add("note-item");
    li.classList.add("item-list");
    li.setAttribute("item-id", counter);


    let title = createNoteTitle();
    li.append(title);

    let body = document.createElement("span");
    body.classList.add("body");
    body.setAttribute("item-id", counter);

    let item = createNoteItem();
    body.append(item);

    li.append(body);
    notesBlock.append(li);


    // createNoteListeners(li);
}

function createNoteListeners(note) {
    console.log(note.querySelectorAll("input[type='text']"));
    note.querySelectorAll("input[type='text']").forEach((input) => {
        input.addEventListener('keypress', onNoteInputKeyPress, false);
    });
}

function createNoteTitle(value) {
    value = value || "";

    let title = document.createElement("span");
    title.classList.add("title");

    let titleInput = document.createElement("input");
    titleInput.classList.add("title-input");
    titleInput.setAttribute("type", 'text');
    titleInput.setAttribute("item-id", counter);
    titleInput.setAttribute("placeholder", 'Title');
    titleInput.value = value;

    title.append(titleInput);

    return title;
}

function createNoteItem() {
    let item = document.createElement("div");
    item.classList.add("note-list-item");
    item.classList.add("checkbox-block"); // -===============

    let itemCheckbox = document.createElement("input");
    itemCheckbox.setAttribute("type", 'checkbox');
    itemCheckbox.setAttribute("item-id", counter);
    item.append(itemCheckbox);

    let itemInput = document.createElement("input");
    itemInput.classList.add("list-item-input"); // -=================
    itemInput.setAttribute("type", 'text');
    itemInput.setAttribute("placeholder", 'Add note');
    itemInput.setAttribute("item-id", counter);
    itemInput.addEventListener('keypress', onNoteInputKeyPress, false);
    item.append(itemInput);

    return item;
}

function onNoteInputKeyPress(e) {
    const keyEnter = "Enter";
    if (e.key === keyEnter) {
        let noteItem = createNoteItem();
        let itemId = this.getAttribute("item-id");

        console.log(itemId);

        notes[itemId].items.push(new Item(this.value));
        this.closest(".body").append(noteItem);

        console.log(notes);
    }
}



// =========================== trash
// let note = new Note();
// note.title = "note test";
//
// note.items.push(new Item("item body"));
//
// notes.push(note);

function pageLoaded () {

    const ul = document.querySelector("ul.notes");



    input.addEventListener("keypress", (keyPressed) => {
        const keyEnter = 13;
        if (keyPressed.which == keyEnter) {

        }
    });
    // ul.addEventListener("click", onClickTodo)
}



// newItem.addEventListener("click", () => { alert("blah");}, false);
newItem.addEventListener("click", function(){
    console.log("-test start");
    // const divEl = document.createElement("div");
    // const textSpan = document.createElement("span");
    // textSpan.classList.add("noteItem");
    // const newTodo = search.value;
    // textSpan.append(newTodo);

    console.log(search.value); //search value in console. test

    console.log("-test end");
    }, false);


