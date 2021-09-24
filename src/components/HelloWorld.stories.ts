import HelloWorld2 from "/@/components/HelloWorld2.vue";


export default {
    component: HelloWorld2,    
    excludeStories: /.*Data$/,
    title: 'HelloWorld2',
 
};

const Template = args => ({
    components: { HelloWorld2 },
    setup() {
        return { args,  };
    },
    template: '<HelloWorld2 v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {    
};