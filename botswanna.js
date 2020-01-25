Vue.component('Bubble', {
  props: ['type', 'data', 'index'],
  computed: {
    isBotText: function() {
      return this.type === 'text' && this.data.bot === true
    },
  },
  template:
  `
    <div class="bubble">
      <div
        class="text-bubble-container"
        v-if="type === 'text'"
        :style="isBotText ? '' : 'justify-content: flex-end'"
      >
        <img
          class="bot-prof-icon"
          v-if="isBotText === true"
          src="assets/img/botswanna-icon.svg"
        >
        <div
          :class="['text-bubble', data.bot ? 'left-text-bubble' : 'right-text-bubble']"
        >
          {{ data.content }}
        </div>
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

Vue.component('BotHeader', {
  props: ['display'],
  template:
  `
    <div>
      <p>Botswanna</p>
      <button name="toggle-display" @click="$emit('toggle-bot')">{{ display ? 'x' : 'o' }}</button>
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
      displayChat: false,
    };
  },
  updated() {
    this.scroll();
  },
  methods: {
    sendMessage(type, data) {
      // Validate type and data
      this.bubbles.push({ type, data })
    },
    removeMessage(index) {
      // Checking to ensure that remove acts within range of this.bubbles
      // Splice 1 Bubble element out in the array
      this.bubbles.splice(index, 1)
    },
    listen(callback) {
      this.callback = callback
    },
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
      // prevent submission of empty messages
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
    async _toggleDisplay() {
      this.displayChat = !this.displayChat;
    },
    scroll() {
      document.getElementById('bubbles-container').scrollTop = document.getElementById('bubbles-container').scrollHeight;
    },
  },
  mounted() {
    // automatically scroll to the bottom of bubbles-container when window is resized
    window.addEventListener('resize', this.scroll);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.scroll);
  }
})
