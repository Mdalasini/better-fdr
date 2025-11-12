import { model, Schema } from "mongoose";
import type { Fixture } from "../types/fixtures";

const GameSchema = new Schema<Fixture>({
  away_id: { type: String, required: true },
  home_id: { type: String, required: true },
  season: { type: String, required: true },
  gameweek: { type: Number, required: true },
  home_xg: { type: Number, default: null },
  away_xg: { type: Number, default: null },
});

export default model<Fixture>("Game", GameSchema);
