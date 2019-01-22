import { LightbotMessenger, Message } from "lightbot";
import * as React from "react";

export type LightbotMessengerProps = {
  hostURL: string;
  agentId: string;
};

export type LightbotMessage = Message;

export interface Messenger {
  messages: LightbotMessage[];
  sendMessage(message: Message): void;
  toggleMessenger(): void;
  isMessengerOpen: boolean;
}

export function withMessenger<C extends Messenger>(
  messengerProps: LightbotMessengerProps
) {
  type OptionalMessenger = { [K in keyof Messenger]+?: Messenger[K] };
  type WrappedComponentProps = C & OptionalMessenger;

  return (
    Component: React.ComponentClass<C> | React.FunctionComponent<C>
  ): React.ComponentClass<WrappedComponentProps> =>
    class LightbotDecorator extends React.Component<WrappedComponentProps> {
      private messenger: LightbotMessenger;

      constructor(props: WrappedComponentProps) {
        super(props);

        this.messenger = new LightbotMessenger({
          ...messengerProps,
          updateListener: this.updateHandler
        });
      }

      public render() {
        return (
          <Component
            {...this.props}
            isMessengerOpen={this.messenger.isOpen}
            messages={this.messenger.messages}
            sendMessage={this.messenger.sendMessage}
            toggleMessenger={this.toggleMessenger}
          />
        );
      }

      private updateHandler = () => {
        this.forceUpdate();
      };

      private toggleMessenger = () => {
        this.messenger.toggleMessenger();
      };
    };
}
