var TaskCollectionView = Backbone.View.extend({
    initialize: function(){
        this.listenTo(this.collection, 'add',this.addOne);
        this.listenTo(this.collection, 'reset',this.render);
        this.views =[]
    },
    addOne: function(task){
        var view = new TaskView({ model : task });
        this.$el.append(view.render().$el);
        this.views.push(view);
    },
    render: function(){
        var _this = this;
        _.each(this.views,function(view){
            view.remove().off();
        })
        this.views =[];
        this.$el.empty();
        this.collection.each(function(model){
            _this.addOne(model);
        })
        return this;
    }
})
var TaskCollectionView = Backbone.View.extend({
    initialize: function(){
        this.listenTo(this.collection, 'add',this.addOne);
        this.listenTo(this.collection, 'reset',this.render);
    },
    addOne: function(task){
        var view = new TaskView({ model : task });
        this.$el.append(view.render().$el);
    },
    render: function(){
        var _this = this;
        //在sort事件触发的render调用时，之前实例化的TaskView对象会泄漏
        this.$el.empty();
        this.collection.each(function(model){
            _this.addOne(model);
        })
        return this;
    }
})
