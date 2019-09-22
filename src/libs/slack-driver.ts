import { IncomingWebhook, IncomingWebhookResult, IncomingWebhookSendArguments } from "@slack/client";
import Env from "../env";

export default class SlackWebhookDriver {
    private webhook: IncomingWebhook;
    private url: string;

    constructor(protected env: any) {
        this.url = env.slack.webhookUrl;
        this.webhook = new IncomingWebhook(env.slack.webhookUrl);
    }

    /**
     * postMessage
     */
    public async postMessage(
        text: string,
        username: string,
        channel = this.env.slack.channel): Promise<IncomingWebhookResult | undefined> {

        const args: IncomingWebhookSendArguments = {
            channel,
            text,
            username,
        };
        try {
            // Send simple text to the webhook channel
            const result: IncomingWebhookResult = await this.webhook.send(args);
            console.log(
                JSON.stringify({
                    args,
                    logMessage: "Slack通知完了",
                    result,
                    url: this.url,
                }),
            );
            return result;
        } catch (e) {

            console.warn(
                JSON.stringify({
                    args,
                    e,
                    logMessage: "Slack通知エラー",
                    url: this.url,
                }),
            );
            return undefined;
        }

    }
}
