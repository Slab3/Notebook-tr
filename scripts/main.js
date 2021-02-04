(function () {
    const search = document.getElementById("search");
    const newItem = document.getElementById("addItem");
    const notesBlock = document.getElementById("notes");

    let counter = 0;

    function generateData() {
        if (!localStorage.getItem('notes')) {
            return;
        }

        let _notes = JSON.parse(localStorage.getItem('notes'));
        counter = Object.keys(_notes).length - 1;

        console.log(_notes);

        for(let key in _notes) {
            createNote(_notes[key].title, _notes[key].items);
        }
    }

    //search -=-------------------------------------------------------------------=
    //test search:
    let testSearchs = document.querySelectorAll(".test-search");

    let noteItems = document.querySelectorAll(".note-item");

    search.addEventListener("keyup", function() {

        Array.prototype.forEach.call(testSearchs, function(el) {
            if (el.textContent.trim().indexOf(search.value) > -1)
                el.style.display = "block";
            else el.style.display = "none";
        });

    });
    // test search end

    // test colors
    // const colors = {
    //     red: createNote
    // }
    // -=--------------------------------------------------------------------------=


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

        constructor(text) {
            this.text = text;
        }
    }

    class Note {
        title = "";
        items = {};
        itemsCounter = 0;

        search = (value) => {

        }
    }

    generateData();

    newItem.addEventListener("click", function() {
        createNote();
    });

    function createNote(title, items) {
        counter++;
        notes[counter] = new Note();
        notes[counter].title = title || "";

        let li = document.createElement("div");
        li.classList.add("note-item");
        li.classList.add("item-list");
        li.setAttribute("note-id", counter);

        // delete item
        let deleteBlock = createDeleteNoteItem();
        li.append(deleteBlock);

        // title
        let noteTitle = createNoteTitle(title);
        li.append(noteTitle);

        let body = document.createElement("div");
        body.classList.add("body");
        body.setAttribute("note-id", counter);

        // first item
        if (items) {
            for(let key in items) {
                let item = createNoteItem(notes[counter], items[key]);
                body.append(item);
            }
        } else {
            let item = createNoteItem(notes[counter]);
            body.append(item);
        }

        li.append(body);
        notesBlock.append(li);

        // add new button
        let addNewItem = createAddNewItemButton();
        li.append(addNewItem);

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
        noteObj.items[noteObj.itemsCounter] = itemObj || new Item("");

        let item = document.createElement("div");
        item.classList.add("note-list-item");
        item.classList.add("checkbox-block");
        item.setAttribute("item-id", noteObj.itemsCounter);

        let itemCheckbox = document.createElement("input");
        itemCheckbox.setAttribute("type", "checkbox");
        itemCheckbox.setAttribute("note-id", counter);
        itemCheckbox.setAttribute("item-id", noteObj.itemsCounter);

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
        itemInput.setAttribute("note-id", counter);
        itemInput.setAttribute("maxlength", "2000");
        itemInput.setAttribute("item-id", noteObj.itemsCounter);

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

