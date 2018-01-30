// Mini Libruary
(function myTool(global){
    
    // RegExp for Selectors
    var sReg = /^(?:\.([\w-]+)|\#([\w-]+))$/;

    var init = {

        // 
        // -------------------- Core Functions --------------------------
        // 
        
        extend: function(obj){
            try {
                if(typeof obj !== "object") throw new Error("The arugument must be a object with methods");
                for(var prop in obj){
                    if(this[prop]) throw new Error("Method: '" + prop + "' already exists! Failure to extend.");
                    this[prop] = obj[prop];
                }
                return this;
            }
            catch(e) { console.error(e.name, e.message) }
        },

        // Selector API, can use .classname or #id
        get: function(selector, ctx){
            var ctx,
                match = sReg.exec(selector);

            ctx = (ctx && typeof ctx === "object")? ctx : document;
            
            if(match[1]){
                this[0] = ctx.getElementsByClassName(match[1]);
            }else if(match[2]){
                this[0] = document.getElementById(match[2]);
            } 

            try {
                if(!this[0]) throw new Error("No selector matches '" + selector +"'!");
                this.length = 1;
                return this;
            } catch(e) { console.error(e.name, e.message) }
        },

        // log the object
        log: function(){
            console.log(this);
        },

        // loop thru an Array
        each: function(callback){
            for(let i = 0; i < this[0].length; i++) {
                var obj = createObj( this[0][i] );

                callback.call(obj, i);
            }
        },

        // Get first item in the array
        first: function(){
            return createObj( this[0][0] );
        },

        // Get last item in the array
        last: function(){
            return createObj( this[0][(this[0].length - 1)] );
        },

        // Get array length
        getLength: function() {
            return this[0].length;
        },

        // add to array
        add: function(elem){
            if(typeof this[0].length) this[0].push(elem[0]);
            return this;
        },

        // Set time out
        wait: function(time, callback){
            setTimeout(callback.bind(this), time);
        },

    };

    // 
    // -------------------- Entry Point --------------------------
    // 

    // Object Constructor
    var iAm = function(selector){

        // if only extend methods, for plugins
        if(!selector) return init;

        var F = Object.create(init);

        if(sReg.exec(selector)){
            return F.get(selector);
        }else if(selector === global){
            return createObj(selector);
        }else if(selector === document){
            return createObj(document);
        } else if(typeof selector === "object") {
            // wrap DOM obj
            return createObj(selector);
        }
        
    };

    // 
    // -------------------- Helper Functions --------------------------
    // 

    // Create an im Object
    // Input is HTMLelement or HTMLCollection
    var createObj = function(elem){
        var obj = Object.create(init);
        obj[0] = elem;
        obj.length = 1;
        return obj;
    };

    // Check if is im Object
    // Input is im Object
    var isObj = function(obj){
        return (obj.length && obj[0] && typeof obj[0])? true : false;
    }

    // 
    // -------------------- Core Methods --------------------------
    // 

    init.extend({

        // DOM onLoad
        onload: function(cb) {
            document.addEventListener("DOMContentLoaded", cb);
        },

        // Query DOM
        find: function(selector) {
            var match = sReg.exec(selector);

            if(match[1]){
                return createObj( this[0].getElementsByClassName(match[1]) );
            }else if(match[2]){
                return createObj( document.getElementById(match[2]) );
            }
        },

        // DOM Manipulate
        // add html
        html: function(html) {
            this[0].innerHTML = html;
            return this;
        },

        // DOM Traversal
        // Return children Array
        children: function(){
            return createObj( this[0].children );
        },

        // Get firstChild of each element in an array
        // Return an Array
        eachChild: function(){
            var match = []
            this.each(function(i){
                match.push(i.firstChild()[0]);
            });
            return createObj( match );
        },

        // Return parent Object
        parent: function(){
            // check if parent is html
            if(!this[0].parentElement) return this;
            return createObj( this[0].parentElement );
        },

        // Return first child Object
        firstChild: function(){
            return createObj( this[0].firstElementChild );
        },

        // Return lastChild Object
        lastChild: function(){
            return createObj( this[0].lastElementChild );           
        },

        // Return nextSibling Object
        nextSibling: function(){
            return createObj( this[0].nextElementSibling );  
        },

        // Return previousSibling
        previousSibling: function(){
            return createObj( this[0].previousElementSibling );
        },

        // Return lastSibling Object
        lastSibling: function(){
            return createObj( this[0].parentElement.children[this[0].parentElement.children.length - 1] ); 
        },

        // Return siblings Array
        siblings: function(){
            if(!this[0].parentElement) return this;
            return createObj( this[0].parentElement.children ); 
        },

        // Return nextSiblings Array
        nextSiblings: function(){
            var match = [],
                next = this[0].nextElementSibling;

            while(next){
                match.push(next);
                next = next.nextElementSibling;
            }

            return createObj( match ); 
        },

        // Return previousSiblings Array
        previousSiblings: function(){
            var match = [],
            next = this[0].previousElementSibling;

            while(next){
                match.push(next);
                next = next.previousElementSibling;
            }

            return createObj( match ); 
        },

        // Return all the matched parent in an array
        parentUntil: function(selector){
            var match = sReg.exec(selector),
                parent = this.parent(),
                parentList = [];

            if(match){
                // if .classname
                if(match[1]){
                    while(parent[0].nodeType === 1){
                        parentList.push(parent[0]);  
                        if(parent.hasClass(match[1])){           
                            break;
                        }
                        parent = parent.parent();
                    }
                }
                // if #id
                else if(match[2]){
                    while(parent[0].nodeType === 1){
                        parentList.push(parent[0]);     
                        if(parent[0].id === match[2]){            
                            break;
                        }
                        parent = parent.parent();
                    }
                }
            }

            // return a Object with HTMLCollection
            return createObj(parentList);
        },
        
        // Get all attribute of a DOM element
        attr: function(attr) {
            return this[0].getAttribute(attr) || undefined;
        },

        data: function(attr){
            return this[0].getAttribute("data-" + attr) || undefined;
        },

        // toggle classname of a DOM element
        toggleClass: function(cls){
            this[0].classList.toggle(cls);
            return this;
        },

        // add classname
        addClass: function(cls){
            this[0].classList.add(cls);
            return this;
        },

        // remove classname
        removeClass: function(cls){
            this[0].classList.remove(cls);
            return this;
        },

        // check if has a classname
        hasClass: function(cls){
            if(!this[0]) return false;
            return this[0].classList.contains(cls)? true : false;
        },

        // css
        css: function(property){
            // if prop is String, then get the css property
            if(typeof property === "string"){
            return global.getComputedStyle(this[0], null).getPropertyValue(property); // Note: the pseudo element is ignored
            }

            // if prop is Object, then set the css property
            // loop thru the obj, stringnify the obj, pass in setAttribute() method
            if(typeof property === "object"){
                var style = "";
                for(var prop in property){
                    style += prop + ":" + property[prop] + ";";
                }
                this[0].setAttribute("style", style);
                return this;
            }
        },

        // toggle display property
        toggle: function(){
            global.getComputedStyle(this[0]).getPropertyValue("display") === "block"?
                this[0].setAttribute("style", "display:none;"):
                this[0].setAttribute("style", "display:block;");
            return this;
        },

        // click event
        // Note: if bubbling is false, the click target has to be this[0], otherwise it can be any child of this[0]
        click: function(callback, bubbling = true){
            this[0].addEventListener("click", (function(e) {
                if(!bubbling) {
                    if(this[0] === e.target) {
                        callback.call(this);
                    }
                } else {
                    callback.call(this);
                }
            }).bind(this), false);
        },

        // // if not click on this element
        // notClickOn: function(elem, callback){
        //     document.addEventListener("click", (function(e){
        //         e.preventDefault();
        //         // if HTMLCollection
        //         if(elem[0].length){
        //             var inArray = [];
        //             elem.each(function(i){
        //                 e.target === i[0]? inArray.push(true) : inArray.push(false);
        //             });
        //             if(!inArray.includes(true)) callback.call(this);
        //         }
        //         // if HTMLElement
        //         else{
        //             if(e.target !== elem[0]) callback.call(this);
        //         } 
        //     }).bind(this), false);
        //     return this;
        // },

        // focus event
        onfocus: function(callback) {
            this[0].addEventListener("focus", callback.bind(this), false);
        },

        focus: function() {
            this[0].focus();
        },

        // blur event (out of focus)
        onblur: function(callback) {
            this[0].addEventListener("blur", callback.bind(this), false);
        },

        // keydown event
        keydown: function(callback) {
            this[0].addEventListener("keydown", callback.bind(this), false);
        },

        // keyup event
        keyup: function(callback) {
            this[0].addEventListener("keyup", callback.bind(this), false);
        },

        // scroll event 
        // on element
        scroll: function(callback) {
            this[0].addEventListener("scroll", callback.bind(this), false);
        },

    });

    // 
    // -------------------- Exit Point --------------------------
    // 

    // Export to Gloabl
    global.im = im = iAm;

})(window);