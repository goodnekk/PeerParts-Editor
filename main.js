var CaretMenu = {
    view: function(vnode) {
        var rect = document.getElementById("selected");
        if(State.CaretMenu.open() && rect){
            rect = rect.getBoundingClientRect();
            return m(".Caret-Menu", {
                style: "top:"+(rect.top+rect.height)+"px;"
                       +"left:"+(rect.left)+"px;"
            },State.CaretMenu.contents().map(function(e, c){
                return m(".Caret-Menu-Option", {
                    class: State.CaretMenu.selected() === c ? "selected": "",
                    onclick: function(){
                        State.CaretMenu.pick();
                    },
                    onmousemove: function(){
                        State.CaretMenu.selected(c);
                    }
                },[
                    m(".Icon", ""),
                    m(".Caret-Menu-Name", e.name),
                    m(".Caret-Menu-Docs", e.docs),
                ])
            }));
        }
    }
};

var Caret = {
    view: function(vnode) {
        var rect = document.getElementById("selected");
        if(rect){
            rect = rect.getBoundingClientRect();
            return m(".Caret", {
                style: "left:"+rect.left+"px;"
                      +"width:"+rect.width+"px;"
                      +"top:"+rect.top+"px;"
                      +"height:"+rect.height+"px;"
            },"");
        }
    }
};

var SceneNode = {
    view: function(vnode) {
        var node = vnode.attrs.node;
        //empty
        if(node.empty){
            return m(".SceneNode-Empty"+".SceneNode-Empty-"+node.type, {
                id: State.Caret.selected(node),
                onclick: State.Caret.onselect(node)
            },[
                node.label ? node.label+"("+node.type+")" : node.type,
                State.Caret.selected(node) === "selected" ? m(".Arrow-Down"): ""
            ]);
        }

        //shape
        if(node.type === "shape"){
            return m(".SceneNode-Shape", {
                class: "SceneNode-"+node.cat,
                id: State.Caret.selected(node),
                onclick: State.Caret.onselect(node)
            },[
                m(".SceneNode-Icon", ""),
                m(".SceneNode-Name", node.name),
                m(".SceneNode-Children", node.children.map(function(c){
                    return m(SceneNode, {node: c});
                }))
            ]);
        }

        //float
        if(node.type === "float"){
            return m(".SceneNode-Float", {
                id: State.Caret.selected(node),
                onclick: State.Caret.onselect(node),
                onmousedown: function(e){
                    if(State.Caret.selected(node) === "selected"){
                        e.preventDefault();
                        e.stopPropagation();
                        State.scrubbing = true;
                        valueoffset = node.value;
                        clickoffset = e.clientY;

                        var mousemove = function(e){
                            node.value = (node.value, valueoffset - (e.clientY - clickoffset)/100);
                            m.redraw();
                            State.Visual.update();
                        };

                        var mouseup = function(e){
                            document.removeEventListener("mousemove", mousemove);
                            document.removeEventListener("mouseup", mouseup);
                            State.scrubbing = false;
                        };
                        document.addEventListener("mousemove", mousemove);
                        document.addEventListener("mouseup", mouseup);
                    }
                }
            },[
                m(".SceneNode-ValueLabel", node.label),
                State.Caret.selected(node) === "selected" ? m(".SceneNode-Value-Selected",[
                    m(".Arrow-Up"),
                    m(".SceneNode-Value", node.value.toFixed(2)),
                    m(".Arrow-Down")
                ]) : m(".SceneNode-Value", node.value.toFixed(2)),
            ]);
        }
    }
};

var SceneEditor = {
    view: function(vnode) {
        return m(".SceneEditor", State.Ast.get().children.map(function(c){
            return m(SceneNode, {node: c});
        }));
    }
};

var Menu = {
    view: function(vnode) {
        return m(".Menu", [
            m(".Menu-title", "Component Test"),
            m(".Menu-status", [
                m("div", "Compile status:"),
                State.Visual.compiles() ? m(".Menu-status-okay", "Resolves"): m(".Menu-status-okay", "Can't reslove")
            ]),
            m(".Menu-Buttons",{
                onclick: function(){
                    State.Caret.swivel();
                }
            },"🔀")
        ]);
    }
};

var App = {
    view: function(vnode) {
        return m(".App", [
            m(Menu),
            m(SceneEditor),
            m(Caret),
            m(CaretMenu)
        ]);
    }
};

m.mount(document.getElementById("editor"), App);
