Vue.component('Bubble', {
  props: ['type', 'data', 'index'],
  template:
  `
    <div>
      <div
        :class="[ 'textBubble', data.bot ? 'leftTextBubble' : 'rightTextBubble' ]"
        v-if="type === 'text'"
      >
        {{ data.content }}
      </div>

      <div
        v-else-if="type === 'buttons'"
        class="suggestion-btn-container"
      >
        <button
          v-for="(button, index) in data.buttons"
          class="suggestion-btn"
          :key="index"
          :name="button.value"
          @click="$emit('button-click', { value: button.value, index: index })"
        >
          {{ button.title }}
        </button>
      </div>
    </div>
  `
})

const Botswanna = Vue.extend({
  props: {
    initBubbles: Array,
  },
  data: function() {
    return { 
      message: '',
      callback: '',
      bubbles: this.initBubbles,
    };
  },
  methods: {
    async _onButtonClick(eventObject) {
      const { value, index } = eventObject
      const data = {
        content: value,
        bot: false
      }
      const type = 'text'
      this.removeMessage(index)
      this.sendMessage(type, data)
      this.callback({ value, trigger: 'button' })
    },
    async _onInputSubmit() {
      if (this.message !== '') {
        const value = this.message
        const data = {
          content: value,
          bot: false
        }
        const type = 'text'
        this.sendMessage(type, data)
        this.callback({ value, trigger: 'text' })
  
        // Delete value from input
        this.message = ''
      }
    },
    removeMessage(index) {
      // Checking to ensure that remove acts within range of this.bubbles
      // Splice 1 Bubble element out in the array
      this.bubbles.splice(index, 1)
    },
    sendMessage(type, data) {
      // Validate type and data
      this.bubbles.push({ type, data })
    },
    listen(callback) {
      this.callback = callback
    }
  },
})
