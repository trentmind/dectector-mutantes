import {Stats, IStats} from '../models/Stats';

export async function returnStats(req, res, next){
    
    try{
        let _stats = await Stats.findOne({},{ _id: 0, __v: 0 }).exec();
        res.status(200).json(_stats);
    }
    catch(err){
        res.status(500).send(err);
    }
}