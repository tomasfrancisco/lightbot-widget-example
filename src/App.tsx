import "./App.css";
import "@progress/kendo-theme-default/dist/all.css";

import {
  LightbotMessengerDecoratedProps,
  withLightbotMessenger,
  LightbotMessage
} from "@lightbase/lightbot/lib/lightbot-react";
import {
  Chat,
  ChatMessageSendEvent,
  Message,
  User
} from "@progress/kendo-react-conversational-ui";
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

  public componentWillReceiveProps(nextProps: any) {
    console.log("receive props", nextProps);
  }

  addNewMessage = (event: ChatMessageSendEvent) => {
    this.props.sendMessage({
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
    const { messages, isMessengerOpen, resetAgent } = this.props;
    return (
      <div>
        <button onClick={this.onToggle}>
          {isMessengerOpen ? "Close" : "Open"}
        </button>
        <button onClick={resetAgent}>Reset agent</button>
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
  agentId: "25143bb9-70e7-4b47-98b4-7a745db72781"
})(AppDisconnected);
