import { model, Schema, Document, Types } from 'mongoose'

interface IMutant extends Document{
    hashDNA: String,
    DNA: Array<string>,
    isMutant: Boolean,
    timestamp: Date
}

const MutantSchema = new Schema({
    hashDNA: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    DNA:{
        type: [String],
        required: true
    },
    isMutant:{
        type: Boolean,
        require: true
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
});

const Mutant = model<IMutant>('Mutant', MutantSchema);

export {Mutant, IMutant};