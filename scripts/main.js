(function () {
    const search = document.getElementById("search");
    const newItem = document.getElementById("addItem");
    const notesBlock = document.getElementById("notes");

    //search
    //test search:
    let testSearchs = document.querySelectorAll(".test-search");

    let noteItems = document.querySelectorAll(".note-item");

    search.addEventListener("keyup", function() {

        Array.prototype.forEach.call(testSearchs, function(el) {
            if (el.textContent.trim().indexOf(search.value) > -1)
                el.style.display = 'block';
            else el.style.display = 'none';
        });

    });
    // test search

    let counter = 0;


    // masonry
    let msnry = new Masonry( notesBlock, {
        // options
        itemSelector: '.item-list',
        columnWidth: '.item-list',
        gutter: 10,
    });

    // const colors = {
    //     red: createNote
    // }

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
        console.log(`Note with id ${counter} created!`)
    });

    function createNote() {
        let li = document.createElement("div");
        li.classList.add("note-item");
        li.classList.add("item-list");
        li.setAttribute("item-id", counter);

        // delete item
        let deleteBlock = deleteNoteItem();
        li.append(deleteBlock);

        // title, note text
        let title = createNoteTitle();
        li.append(title);

        let body = document.createElement("div");
        body.classList.add("body");
        body.setAttribute("item-id", counter);

        let item = createNoteItem();
        body.append(item);

        li.append(body);
        notesBlock.append(li);

        let addNewItem = createAddNewItemButton();
        li.append(addNewItem);

        msnry.appended(li);
        msnry.layout();
    }

    // creating new item textarea and checkbox in div.body
    function createAddNewItemButton() {
        let addRowWrapper = document.createElement("div");
        addRowWrapper.classList.add("block-add-textarea");
        let button = document.createElement("button");
        button.classList.add("add-textarea");
        button.innerText = "+";

        button.addEventListener("click", function () { //====================-------- append undefined
            let item = createNoteItem();
            this.closest('.note-item').querySelector('.body').append(item);
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
        titleInput.setAttribute("type", 'text');
        titleInput.setAttribute("item-id", counter);
        titleInput.setAttribute("placeholder", 'Title');
        titleInput.setAttribute("maxlength", '50');
        autosize(titleInput);
        titleInput.addEventListener('autosize:resized', function(){
            msnry.layout();
        });
        titleInput.value = value;


        title.append(titleInput);

        return title;
    }

    // create note item textarea
    function createNoteItem() {
        let item = document.createElement("div");
        item.classList.add("note-list-item");
        item.classList.add("checkbox-block"); // -===============

        let itemCheckbox = document.createElement("input");
        itemCheckbox.setAttribute("type", 'checkbox');
        itemCheckbox.setAttribute("item-id", counter);
        itemCheckbox.setAttribute("status", "false");

        item.append(itemCheckbox);


        let itemInput = document.createElement("textarea");
        itemInput.classList.add("list-item-input"); // -=================
        itemInput.setAttribute("placeholder", 'Add note');
        itemInput.setAttribute("item-id", counter);
        itemInput.setAttribute("maxlength", "2000");
        autosize(itemInput);
        itemInput.addEventListener('autosize:resized', function(){
            msnry.layout();
        });
        item.append(itemInput);

        return item;
    }

    //delete note item
    function deleteNoteItem() {
        let deleteBlock = document.createElement("div");
        deleteBlock.classList.add("delete-block");
        let deleteItem = document.createElement("span");
        deleteItem.classList.add("delete-item");
        deleteItem.setAttribute("item-id", counter);
        deleteItem.innerText = "Х";
        deleteBlock.append(deleteItem);

        deleteBlock.addEventListener("click", function () {
            this.closest('div.note-item').remove();
            console.log(`Note removed!`)
            msnry.layout();
        });


        return deleteBlock;
    }




    // creating element

    // function onNoteInputKeyPress(e) {
    //     const keyEnter = "Enter";
    //     if (e.key === keyEnter) {
    //         if (!this.value) {
    //             return;
    //         }
    //         if (this.lastChild === "null") {
    //             return;
    //         }
    //         let noteItem = createNoteItem();
    //         let itemId = this.getAttribute("item-id");
    //
    //         console.log(itemId);
    //
    //         notes[itemId].items.push(new Item(this.value));
    //         this.closest(".body").append(noteItem);
    //
    //         console.log(notes);
    //     }
    // }





    // ========================= ------------------------------ == trash
    // let note = new Note();
    // note.title = "note test";
    //
    // note.items.push(new Item("item body"));
    //
    // notes.push(note);

    // function pageLoaded () {
    //
    //     const ul = document.querySelector("ul.notes");
    //
    //
    //
    //     input.addEventListener("keypress", (keyPressed) => {
    //         const keyEnter = 13;
    //         if (keyPressed.which == keyEnter) {
    //
    //         }
    //     });
    //     // ul.addEventListener("click", onClickTodo)
    // }



    // // newItem.addEventListener("click", () => { alert("blah");}, false);
    // newItem.addEventListener("click", function(){
    //     console.log("-test start");
    //     // const divEl = document.createElement("div");
    //     // const textSpan = document.createElement("span");
    //     // textSpan.classList.add("noteItem");
    //     // const newTodo = search.value;
    //     // textSpan.append(newTodo);
    //
    //     console.log(search.value); //search value in console. test
    //
    //     console.log("-test end");
    //     }, false);

})(); // end of main function

