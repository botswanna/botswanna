const converter = new showdown.Converter()

const BotHeader = {
  props: ['name'],
  template:
  ` 
    <div class="chat-header">
      <div class="chat-expand">
      </div>
      <div
        class="chat-header-title"
        :name="name"
      >
        {{ name }}
      </div>
      <div class="chat-close">
        <img
          class="chat-close-icon"
          src="/assets/chat-close-icon.svg"
          @click="$emit('toggle-display')"
        >
      </div>
    </div>
  `,
};

const Bubble = {
  props: {
    type: {
      type: String,
    },
    data: {
      type: Object,
    },
    bubbleIndex: {
      type: Number,
    },
    iconURL: {
      type: String,
    },
    displayMarkdown: {
      type: Boolean,
    }
  },
  computed: {
    isBotText: function() {
      return this.type === 'text' && this.data.bot === true
    },
    parseNewLines: function() {
      const parsedContent = this.data.content.split('\n').filter((word) => word !== '').join('<br>')
      return parsedContent
    },
    // use showdown package markdown converter
    parseMarkdown: function() {
      const splitContent = this.data.content.split('\n\n')

      // marker to keep track of whether the previous item is a list
      let isList = false

      // logic for rendering blocks - the if statements contain the
      // cases
      const parsedContent = splitContent.reduce((acc, curr, ix) => {
        const blockStartsWithList = curr[0] === '1' || curr[0] === '-'
        const blockContainsList = curr.split('\n').filter((phrase) => phrase !== '').reduce((acc, curr) => {
          if (curr[0] === '1' || curr[0] === '-') {
            return true
          }
          return acc === true ? true : false
        }, false)

        let result
        if (ix === 0) {
          result = acc + curr
        } else {
          if (blockContainsList) {
            result = blockStartsWithList ? acc + `\n\n${curr}` : acc + `<br><br>${curr}`
            isList = true
          } else {
            // only swap new line markers with break tags if two consecutive
            // text blocks are both NOT lists
            result = isList ? acc + `\n\n${curr}` : acc + `<br><br>${curr}`
            isList = false
          }
        }
        prevBlockStartList = blockStartsWithList
        return result
      }, '')
      return converter.makeHtml(parsedContent)
    }
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
          :src="iconURL"
        >
        <div
          :class="['text-bubble', data.bot ? 'left-text-bubble' : 'right-text-bubble']"
        >
          <span
            v-if="displayMarkdown && data.bot"
            v-html="parseMarkdown"
            class="text-bubble-content-container"
          ></span>
          <span
            v-if="!(displayMarkdown && data.bot)"
            class="text-bubble-content-container"
          >
            <p>{{parseNewLines}}</p>
          </span>
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
          @click="$emit('button-click', { value: button.value, index: bubbleIndex })"
        >
          {{ button.title }}
        </button>
      </div>

      <div
        v-else-if="type === 'linkout'"
        class="linkout-btn-container"
      >
        <div
          class="linkout-btn"
          @click="$emit('linkout-click', { url: data.url })"
        >
          <p class="linkout-content">
            {{ data.title }}
          </p>
          <svg class="linkout-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
            <path d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1z">
            </path>
          </svg>
          </img>
        </div>
      </div>
    </div>
  `,
};

const BotTextInput = {
  props: {
    value: {
      type: String
    }
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    }
  },
  template:
  `
    <div class="input-box">
        <input
          class="chat-input"
          type="text"
          @input="updateValue($event.target.value)"
          @keyup.enter="$emit('input-submit')"
          placeholder="Type something"
          :value="value"
        ></input>
      <div class="input-submit">
        <img
          class="input-submit-icon"
          src="/assets/input-submit-icon.svg"
          @click="$emit('input-submit')"
        >
      </div>
    </div>
  `,
};

const BotMinimized = {
  props: {
    iconURL: {
      type: String
    }
  },
  template:
  `
    <div
      class="chat-minimized"
    >
        <img
          class="chat-open-icon"
          :src="iconURL"
          @click="$emit('toggle-display')"
        >
    </div>
  `,
};

const Botswanna = Vue.extend({
  props: {
    initBubbles: Array,
    initName: {
      type: String,
      default: 'Botswanna',
    },
    useMarkdown: {
      type: Boolean,
      default: true,
    },
    iconURL: {
      type: String,
      default: '/assets/botswanna-icon.svg',
    },
    display: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    'bot-header': BotHeader,
    'bubble': Bubble,
    'bot-text-input': BotTextInput,
    'bot-minimized': BotMinimized,
  },
  data: function() {
    return { 
      message: '',
      callback: '',
      name: this.initName,
      bubbles: this.initBubbles,
      displayChat: this.display,
      displayMarkdown: this.useMarkdown,
    };
  },
  updated() {
    this.scroll();
  },
  methods: {
    sendMessage(type, data, multi=false) {
      // the multi option allows you to decide whether you want to send a
      // message with line breaks in it as multiple messages or as one message
      if (multi) {
        const { content } = data
        const contentArr = content.split('\n\n').filter((phrase) => phrase !== '')
        contentArr.filter((str) => str !== '').forEach((phrase) => this.bubbles.push({ type, data: {
          content: phrase.trim(),
          bot: true,
        }}))
      } else {
        this.bubbles.push({ type, data })
      }
      // Validate type and data
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
    async _onLinkoutClick(eventObject) { {
      const { url } = eventObject
      window.open(url, '_blank')
    }
      
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
  },
  template:
  `
    <div class="container">
      <!-- Add Botswanna container -->
      <transition name="fade">
        <div 
          class="chat"
          v-show="displayChat"
        >
          <!-- chatbot header -->
          <bot-header
            @toggle-display="_toggleDisplay"
            :name="name"
          >
          </bot-header>
          <!-- container which stores the speech bubbles -->
          <div class="bubbles-container" id="bubbles-container">
            <bubble
              v-for="(eachBubble, index) in bubbles"
              :type="eachBubble.type"
              :data="eachBubble.data"
              :key="index"
              :bubbleIndex="index"
              :iconURL="iconURL"
              :displayMarkdown="displayMarkdown"
              @button-click="_onButtonClick"
              @linkout-click="_onLinkoutClick"
            ></bubble>
          </div>
          <!-- text input box -->
          <bot-text-input
            v-model="message"
            @input-submit="_onInputSubmit"
          >
          </bot-text-input
          >
        </div>
      </transition>
      <transition name="fade">
        <bot-minimized
          :iconURL="iconURL"
          v-show="!displayChat"
          @toggle-display="_toggleDisplay"
        >
        </bot-minimized>
      </transition>
    </div>
  `
})