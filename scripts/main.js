(function () {
    const search = document.getElementById("search");
    const newItem = document.getElementById("addItem");
    const notesBlock = document.getElementById("notes");
    const searchKeyup = new Event('keyup');

    let counter = 0;


    
    function generateData() {
        if (!localStorage.getItem("notes")) {
            return;
        }

        let _notes = JSON.parse(localStorage.getItem("notes"));

        for(let key in _notes) {
            createNote(_notes[key]);
        }
        if (localStorage.getItem("search")){
            search.value = localStorage.getItem("search");
            search.dispatchEvent(searchKeyup);
        }
    }

    //search
    search.addEventListener("keyup", function() {
        for(let key in notes) {
            let note = notes[key];
            let noteElement = document.querySelector(`.note-item[note-id="${note.id}"]`);
            if (!searchNote(note, this.value)) {
                noteElement.classList.add('hidden');
            } else {
                noteElement.classList.remove('hidden');
            }
            msnry.layout();
        }
        syncSearchStatus()
    });

    function searchNote(note, value) {
        let found = false;
        if (note.title.indexOf(value) > -1) {
            found = true;
        }

        let items = note.items;
        for(let ikey in items) {
            let item = items[ikey];

            if (item.text.indexOf(value) > -1) {
                found = true;
            }
        }
        return found;
    }
    // search localStorage
    function syncSearchStatus() {
        localStorage.setItem("search", search.value);
    }
    // search end


    // masonry
    let msnry = new Masonry( notesBlock, {
        // options
        itemSelector: ".item-list",
        columnWidth: ".item-list",
        gutter: 10,
    });

    // создать class note, и в него записать все данные о карточке , а потом его можно сохранить целиком в localstorage
    let notes = {};

    class Item {
        status = false;
        text = "";
        id = null;

        constructor(text) {
            this.text = text;
        }
    }

    class Note {
        id = 0;
        title = "";
        items = {};
        color = "#DBE7FF";
        itemsCounter = 0;

    }

    generateData();

    function generateColor() {
        return "hsl(" + 360 * Math.random() + ',' +
            (25 + 70 * Math.random()) + '%,' +
            (85 + 10 * Math.random()) + '%)'
    }

    newItem.addEventListener("click", function() {
        createNote();
    });

    function createNote(note) {
        counter++;
        if (!note) {
            note = new Note();
            note.id = counter;
            note.title = "";
            note.color = generateColor();
            notes[note.id] = note;
        } else {
            notes[note.id] = note;
        }

        let li = document.createElement("div");
        li.classList.add("note-item");
        li.classList.add("item-list");
        li.setAttribute("note-id", note.id);
        li.style.background = note.color;

        // delete item
        let deleteBlock = createDeleteNoteItem();
        li.append(deleteBlock);

        // title
        let noteTitle = createNoteTitle(note.title);
        li.append(noteTitle);

        let body = document.createElement("div");
        body.classList.add("body");
        body.setAttribute("note-id", note.id);

        // first item
        if (Object.keys(note.items).length) {
            for(let key in note.items) {
                let item = createNoteItem(note, note.items[key]);
                body.append(item);
            }
        } else {
            let item = createNoteItem(note);
            body.append(item);
        }

        li.append(body);
        notesBlock.append(li);

        // add new button
        let addNewItem = createAddNewItemButton();
        li.append(addNewItem);

        // add Date
        let addDateBlock = createAddDateField();
        li.append(addDateBlock);

        msnry.appended(li);
        msnry.layout();
        syncData();
        console.log(`Note with id ${counter} created!`);

    }

    // creating new item textarea and checkbox in div.body
    function createAddNewItemButton() {
        let addRowWrapper = document.createElement("div");
        addRowWrapper.classList.add("block-add-textarea");
        let button = document.createElement("button");
        button.classList.add("add-textarea");
        button.innerText = "+";

        button.addEventListener("click", function () { //====================-------- append undefined
            let noteObj = getNoteObj(this.closest(".note-item"));
            let item = createNoteItem(noteObj);
            this.closest(".note-item").querySelector(".body").append(item);
            syncData();
            msnry.layout();
        });

        addRowWrapper.append(button);
        return addRowWrapper;
    }


    //create title textarea
    function createNoteTitle(value) {
        value = value || "";

        let title = document.createElement("span");
        title.classList.add("title");

        let titleInput = document.createElement("textarea");
        titleInput.classList.add("title-input");
        titleInput.setAttribute("type", "text");
        titleInput.setAttribute("note-id", counter);
        titleInput.setAttribute("placeholder", "Title");
        titleInput.setAttribute("maxlength", "50");

        // Storage saving data title
        titleInput.addEventListener("keyup", function () {
            let note = getNoteObj(this);
            note.title = this.value;
            console.log(notes);

            syncData();
        });

        autosize(titleInput);
        titleInput.addEventListener('autosize:resized', function(){
            msnry.layout();
        });
        titleInput.value = value;

        title.append(titleInput);

        return title;
    }

    // create note item textarea
    function createNoteItem(noteObj, itemObj) {
        // create item in note;
        if (!itemObj) {
            itemObj = new Item("");
            itemObj.id = noteObj.itemsCounter;
            noteObj.items[noteObj.itemsCounter] = itemObj;
        }

        let item = document.createElement("div");
        item.classList.add("note-list-item");
        item.classList.add("checkbox-block");
        item.setAttribute("item-id", itemObj.id);

        let itemCheckbox = document.createElement("input");
        itemCheckbox.setAttribute("type", "checkbox");
        itemCheckbox.setAttribute("note-id", noteObj.id);
        itemCheckbox.setAttribute("item-id", itemObj.id);

        if (itemObj) {
            itemCheckbox.checked = itemObj.status;
            if (itemObj.status) {
                item.classList.add("done")
            }
        }

        // changing styles of
        itemCheckbox.addEventListener("change", function () {
            let noteId = this.getAttribute('note-id');
            let itemId = this.getAttribute('item-id');

            if (this.checked) {
                this.closest('.note-list-item').classList.add('done');
            } else {
                this.closest('.note-list-item').classList.remove('done');
            }
            notes[noteId].items[itemId].status = this.checked;
            syncData();
        });

        item.append(itemCheckbox);

        let itemInput = document.createElement("textarea");
        itemInput.classList.add("list-item-input");
        itemInput.setAttribute("placeholder", "Add note");
        itemInput.setAttribute("status", "false"); // -=-=-=-=-= testing line-through
        itemInput.setAttribute("note-id", noteObj.id);
        itemInput.setAttribute("maxlength", "2000");
        itemInput.setAttribute("item-id", itemObj.id);

        // itemInput test
        if (itemObj) {
            itemInput.value = itemObj.text;
        }

        noteObj.itemsCounter++;
        // note item saving. if add new note, it will be with not correct id. (just need to see this for understand)
        itemInput.addEventListener("keyup", function () {
            let itemId = this.getAttribute("item-id");
            noteObj.items[itemId].text = this.value;
            syncData();
            console.log(notes);
        });

        autosize(itemInput);
        itemInput.addEventListener('autosize:resized', function(){
            msnry.layout();
        });
        item.append(itemInput);

        return item;
    }

    function createDeleteNoteItem() {
        let deleteNoteBlock = document.createElement("div");
        deleteNoteBlock.classList.add("delete-block");
        let deleteNote = document.createElement("span");
        deleteNote.classList.add("delete-item");
        deleteNote.setAttribute("note-id", counter);
        deleteNote.innerText = "Х";
        deleteNoteBlock.append(deleteNote);

        deleteNote.addEventListener("click", function () {
            deleteNoteObj(this);
            this.closest("div.note-item").remove();
            msnry.layout();
            syncData();

            console.log(`Note removed!`)
        });

        return deleteNoteBlock;
    }

    function createAddDateField() {
        // add date
        let addDateBlock = document.createElement("div");
        addDateBlock.classList.add("add-date-block");
        let addDateField = document.createElement("span");
        addDateField.classList.add("date-field");
        addDateField.setAttribute("note-id", counter);
        addDateField.innerText = "date-field";
        addDateBlock.append(addDateField);

        // creating data
        let dateOfPost = new Date();
        addDateField.innerText = dateOfPost.toLocaleString();
        // addDateField.innerText = dateOfPost.toDateString() + "; " + dateOfPost.toLocaleTimeString();



        // addDateField.addEventListener("click", function () {
        //     deleteNoteObj(this);
        //     this.closest("div.note-item").remove();
        //     msnry.layout();
        //     syncData();
        //
        //     console.log(`Note removed!`)
        // });

        return addDateBlock;
    }


    // save data in local storage
    function syncData() {
        localStorage.setItem("notes", JSON.stringify(notes));
        console.log(notes);
    }

    function getNoteObj(el) {
        let id = el.getAttribute("note-id");
        return notes[id];
    }

    function deleteNoteObj(el) {
        let id = el.getAttribute("note-id");
        delete notes[id];
    }

})(); // end of main function

