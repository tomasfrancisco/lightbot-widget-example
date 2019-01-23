import "./App.css";
import "@progress/kendo-theme-default/dist/all.css";

import {
  Chat,
  ChatMessageSendEvent,
  Message,
  User
} from "@progress/kendo-react-conversational-ui";
import {
  LightbotMessage,
  LightbotMessengerDecoratedProps,
  withLightbotMessenger
} from "lightbot/lib/lightbot-react";
import React, { Component } from "react";

interface AppProps extends LightbotMessengerDecoratedProps {}

class AppDisconnected extends Component<
  AppProps,
  {
    bot: User;
    user: User;
  }
> {
  constructor(props: AppProps) {
    super(props);
    const bot = {
      id: 0
    };

    this.state = {
      bot,
      user: {
        id: 1,
        avatarUrl: "https://via.placeholder.com/24/008000/008000.png"
      }
    };
  }

  public transformMessages = (messages: LightbotMessage[]): Message[] => {
    return messages.map<Message>(message => ({
      author: message.sender === "bot" ? this.state.bot : this.state.user,
      text: message.label
    }));
  };

  addNewMessage = (event: ChatMessageSendEvent) => {
    this.props.sendMessage({
      sender: "human",
      type: "plain",
      label: event.message.text as string
    });
  };

  countReplayLength = (question?: string) => {
    return `${question} contains exactly ${
      question ? question.length : 0
    } symbols.`;
  };

  render() {
    const { user } = this.state;
    const { messages, isMessengerOpen } = this.props;
    return (
      <div>
        <button onClick={this.onToggle}>
          {isMessengerOpen ? "Close" : "Open"}
        </button>
        {isMessengerOpen && (
          <Chat
            user={user}
            messages={this.transformMessages(messages)}
            onMessageSend={this.addNewMessage}
            placeholder={"Type a message..."}
            width={400}
          />
        )}
      </div>
    );
  }

  private onToggle = () => {
    this.props.toggleMessenger();
  };
}

export const App = withLightbotMessenger<AppProps>({
  hostURL: "https://api.lightbot.io/v1/passthrough",
  agentId: "7a1eedf8-3afa-4281-b254-9f9d9bc97f6a"
})(AppDisconnected);
