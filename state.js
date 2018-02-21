var State = {};

State.Visual = (function(){
    var scene;
    return {
        compiles: function(){
            return scene !== undefined;
        },
        update: function(){
            scene = Grammar.compile(State.Ast.get());
            if(scene) {
                renderer.loadScene([
                    shaders.vertex,
                    shaders.fragment.compose(scene, Grammar.getFunc())
                ])
            }
        }
    }
})();

State.Ast = (function(){
    /*var Ast = {
        type: "component",
        children: [
            {
                type: "shape",
                name: "sphere",
                children: [
                    {
                        type: "float",
                        label: "radius",
                        empty: true
                    }
                ]
            }
        ]
    };*/
    var Ast = {
        type: "component",
        children: [
            {
                type: "shape",
                empty: true
            }
        ]
    };

    return {
        get: function(){
            return Ast;
        },
        insert: function(node, ins){
            node.empty = false;
            node.type = ins.type;
            node.cat = ins.cat;
            node.name = ins.name;
            node.value = ins.value;
            if(ins.args){
                node.children = ins.args.map(function(a,c){

                    //if you can keep the child keep it
                    //otherwise replace it with an empty
                    if(node.children && node.children[c]){
                        if(node.children[c].type === a.type){
                            return node.children[c];
                        }
                    }
                    return {
                        empty: true,
                        type: a.type,
                        label: a.label
                    }

                })
            }

            State.Visual.update();
        },
        swivel: function(node){
            var save = JSON.parse(JSON.stringify(node));
            node.empty = true;
            node.type = "shape",
            node.children = [save];
        }
    }
})();

State.Caret = (function(){

    //focus on first child
    var C = State.Ast.get().children[0];


    return {
        get: function(){
            return C;
        },
        selected: function(n){
            return C===n ? "selected": "";
        },
        onselect: function(n){
            return function(e){
                C = n;
                if(C.empty){
                    State.CaretMenu.toggle();
                } else {
                    State.CaretMenu.toggle(false);
                }



                e.preventDefault();
                e.stopPropagation();
                return false;
            };
        },
        insert: function(n){
            State.Ast.insert(C, n);
            if(C.children){
                C = C.children[0];
                if(C.empty){
                    State.CaretMenu.toggle();
                }
            }
        },
        swivel: function(){
            State.Ast.swivel(C);
        }
    }
})();

State.CaretMenu = (function(){
    var Open = false;
    var Selected = 0;

    return {
        open: function(){
            return Open;
        },
        toggle: function(v){
            if(v!== undefined){
                Open = v;
            } else {
                Open = !Open;
            }
            Selected = 0;
        },
        contents: function(){
            return Grammar.getType(State.Caret.get().type);
        },
        selected: function(c){
            if(c!==undefined){
                Selected = c;
            }
            return Selected;
        },
        pick: function(){
            State.Caret.insert(State.CaretMenu.contents()[Selected]);
            State.CaretMenu.toggle();
        }
    }
})();
