// Mini Libruary
(function myTool(global){
    
    // RegExp for Selectors
    var sReg = /^(?:\.([\w-]+)|\#([\w-]+))$/;

    // Function Bank
    var init = {
        // Extend Functions
        extend: function(obj, name){
            if(typeof obj !== "object" && typeof obj !== "function") return "Argument must be an Object or function!";
            
            if(typeof obj === "object"){
                for(var prop in obj){
                    if(this[prop]) return "An object with same name already exists!";
                    this[prop] = obj[prop];
                }
            }else if(typeof obj === "function"){
                var name = name || obj[name];
                if(!name) "Function cannot be anonymouse!";
                this[name] = obj;
            }

            return this;
        },

        // Selector API, can use .classname or #id
        get: function(selector, ctx){
            if(typeof selector !== "string") return "Selector must be String Type";
            var match = sReg.exec(selector),
                ctx;

            if(!match) return "No selector matches!";

            ctx = (ctx && typeof ctx === "object")? ctx : document;

            if(match[1]){
                this[0] = ctx.getElementsByClassName(match[1]);
            }else if(match[2]){
                this[0] = ctx.getElementById(match[2]);
            }

            this.length = 1;
            return this;
        },

        // log the object
        log: function(){
            console.log(this);
        },

        // loop thru an Array
        each: function(arr, callback){
            var array,
                fn;

            // check if arr is passed as 1st param
            if(arguments.length === 2){
                if(!arr.length && typeof callback !== "function") return "Parameter Type Error!";
                array = arr;
                fn = callback;
            }

            // if only one parameter passed in
            if(arguments.length === 1){
                // if only pass in array, but not callback function, return the array
                // if(arr.length) return arr;
                // if only pass in callback function
                if(typeof arr === "function") fn = arr;
                // if HTMLCollection array is exists, assign it to array
                if(this[0]) array = this[0];
            }

            // now array & fn is ready, do something
            for(var i = 0; i < array.length; i++){
                // each iteration is an IIFE, so that this of the callback function 
                // in each iteration is unique
                (function(j, f){
                    // New object created each time, so this will refer to this new obj
                    var obj = Object.create(init);
                    obj[0] = array[j];
                    // change this and the argument to obj
                    f.call(obj, obj);
                })(i, fn);
            }
        },

        // Get first item in the array
        first: function(){
            // this[0] = this[0][0];
            // return this;
            return createObj( this[0][0] );
        },

        // Get last item in the array
        last: function(){
            // this[0] = this[0][(this[0].length - 1)];
            // return this;
            return createObj( this[0][(this[0].length - 1)] );
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

    // Object Constructor
    var iAm = function(selector){
        var F = Object.create(init);

        if(sReg.exec(selector)){
            return F.get(selector);
        }else if(selector === global){
            return createObj(selector);
        }else if(selector === document){
            return createObj(document);
        }
        
    };


    // Helper Functions

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


    // Extend features
    init.extend({

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

        // Return lastSibling Object
        lastSibling: function(){
            return createObj( this[0].lastElementSibling ); 
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

            while(next.nodeType === 1){
                match.push(next);
                next = next.nextElementSibling;
            }

            return createObj( match ); 
        },

        // Return previousSiblings Array
        previousSiblings: function(){
            var match = [],
            next = this[0].previousElementSibling;

            while(next.nodeType === 1){
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
        data: function(attr){
            if(typeof attr !== "string") return "Attributes must be String Type";
            return this[0].getAttribute("data-" + attr) || undefined;
        },

        // toggle classname of a DOM element
        toggleClass: function(cls){
            if(typeof cls !== "string") return "Class name must be String Type";
            this[0].classList.toggle(cls);
            return this;
        },

        // add classname
        addClass: function(cls){
            if(typeof cls !== "string") return "Class name must be String Type";
            this[0].classList.add(cls);
            return this;
        },

        // remove classname
        removeClass: function(cls){
            if(typeof cls !== "string") return "Class name must be String Type";
            this[0].classList.remove(cls);
            return this;
        },

        // check if has a classname
        hasClass: function(cls){
            if(typeof cls !== "string") return "Class name must be String Type";
            if(!this[0]) return false;
            return this[0].classList.contains(cls)? true : false;
        },

        // css
        // Argument: String: the css property name, or Object: in key value pair
        css: function(property){
            if(typeof property !== "string" && typeof property !== "object") return "Property can be only String or Object type";

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
        click: function(callback){
            if(typeof callback !== "function") return "Paramete Type Error";
            this[0].addEventListener("click", callback.bind(this), false);
        },

        // if not click on this element
        notClickOn: function(elem, callback){
            if(typeof callback !== "function") return "Parameter is not in Function Type!";
            if(!isObj(elem)) return "Must pass in an im Object!";

            document.addEventListener("click", (function(e){
                e.preventDefault();
                // if HTMLCollection
                if(elem[0].length){
                    var inArray = [];
                    elem.each(function(i){
                        e.target === i[0]? inArray.push(true) : inArray.push(false);
                    });
                    if(!inArray.includes(true)) callback.call(this);
                }
                // if HTMLElement
                else{
                    if(e.target !== elem[0]) callback.call(this);
                } 
            }).bind(this), false);
            return this;
        },

        // innerHTML
        html: function(html){
            if(typeof html === "string")
                return this[0].innerHTML = html;
        },

    });

    // export to gloabl
    global.im = iAm;

})(window);