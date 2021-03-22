import { model, Schema, Document, Types } from 'mongoose'

interface IStats extends Document{
    count_mutant_dna: Number,
    count_human_dna: Number,
    ratio: Number
}

const StatsSchema = new Schema({
    count_mutant_dna: {
        type: Number,
        required: true
    },
    count_human_dna:{
        type: Number,
        required: true
    },
    ratio:{
        type: Number,
        required: true
    }
});

const Stats = model<IStats>('Stats', StatsSchema);

export {Stats, IStats};