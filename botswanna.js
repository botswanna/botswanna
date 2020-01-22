Vue.component('Bubble', {
  props: ['type', 'data', 'index'],
  template:
  `
    <div>
      <div
        v-if="type === 'text'"
      >
        <p>{{ data.bot ? "Bot" : "Human" }} : {{ data.content }}</p>
      </div>

      <div
        v-else-if="type === 'buttons'"
        v-for="button in data.buttons"
      >
        <button 
          :name="button.value"
          @click="$emit('button-click', { value: button.value, index: index })"
        >
          {{ button.title }}
        </button>
      </div>
    </div>
  `
})

const Botswanna = new Vue({
  el: '#botswanna',
  data: { 
    message: 'default',
    bubbles: [
      { 
        type: 'text', 
        data: {
          content: 'Learn JavaScript',
          bot: true
        }
      },
      { 
        type: 'buttons', 
        data: {
          buttons: [
            { 
              title: 'Learn Vue', 
              value: 'Vue' 
            },
            { 
              title: 'Learn React', 
              value: 'React' 
            }
          ]
        }
      },
      { 
        type: 'text',
        data: {
          content: 'Build something awesome',
          bot: false 
        }
      }
    ]
  },
  methods: {
    _buttonClick(eventObject) {
      const { value, index } = eventObject
      const data = {
        content: value,
        bot: false
      }
      const type = 'text'

      this.remove(index)
      this.add(type, data)
    },
    remove(index) {
      // Checking to ensure that remove acts within range of this.bubbles
      // Splice 1 Bubble element out in the array
      this.bubbles.splice(index, 1)
    },
    add(type, data) {
      // Validate type and data
      this.bubbles.push({ type, data })
    },
  }
})