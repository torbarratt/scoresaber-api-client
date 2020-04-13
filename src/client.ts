import {Player, ScoreReply} from "./representations";
import {IRestResponse, RestClient} from "typed-rest-client/RestClient";

export class ScoreSaberApi {

    private static readonly HOST: string = 'https://new.scoresaber.com/api/player/';

    private readonly restClient: RestClient = new RestClient(null, ScoreSaberApi.HOST);

    public async getPlayer(id: string): Promise<Player> {
        const response: IRestResponse<Player> = await this.restClient.get<Player>(`${id}/full/`);

        if (response.result === null) {
            throw new Error(`Failed to fetch player ${id} (status=${response.statusCode})`);
        }

        return response.result;
    }

    public async getScores(id: string, order: ScoreOrder, offset: number): Promise<ScoreReply> {
        const orderPath = ScoreSaberApi.getPathByScoreOrder(order);

        const response: IRestResponse<ScoreReply> = await this.restClient.get<ScoreReply>(`${id}/scores/${orderPath}/${offset}`);

        if (response.result === null) {
            throw new Error(`Failed to fetch scores for ${id} (status=${response.statusCode})`);
        }

        return response.result;
    }

    private static getPathByScoreOrder(order: ScoreOrder): string {
        switch (order) {
            case ScoreOrder.RECENT:
                return 'recent';
            case ScoreOrder.TOP:
                return 'top';
            default:
                throw new Error(`Unsupported ScoreOrder: ${order}`);
        }
    }

}

export enum ScoreOrder {
    TOP,
    RECENT
}
