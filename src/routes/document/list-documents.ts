/* tslint:disable:no-console */
import { RequestHandler } from 'express';
import {
  RequestError,
  RequestErrorType,
} from '../../error-handler/RequestError';
import { Promise as BluePromise } from 'bluebird';
import * as mongoose from 'mongoose';

import { Document } from '../../models/Document';
import { User } from '../../models/User';
import { DocType } from '../../models/DocType';

export const listDocsFolders: RequestHandler = async (req, res, next) => {
  try {
    const matchCond: any = { isDelete: false };
    if (req.query && req.query.caseId) {
      matchCond.case = mongoose.Types.ObjectId(req.query.caseId);
    }
    const groupedDocs = await Document.aggregate([
      { $match: matchCond },
      { $unwind: '$accessRights' },
      {
        $group: {
          _id: '$docType',
          ar: { $addToSet: '$accessRights' },
        },
      },
    ]).exec();

    let details: any = [];

    if (groupedDocs.length) {
      details = await BluePromise.map(groupedDocs, async (docs: any) => {
        const [dc, records, documents] = await BluePromise.all([
          DocType.findOne(docs._id)
            .select('docType')
            .lean()
            .exec(),
          User.find({ _id: { $in: docs.ar } })
            .select('firstName lastName')
            .lean()
            .exec(),
          Document.find({ docType: docs._id })
            .lean()
            .exec(),
        ]);

        (dc as any).accessRights = records;
        (dc as any).documents = documents;

        return dc;

        // return [dc, ...records];

        // const dc = await DocType.findOne(docs._id)
        //   .select('docType')
        //   .exec();
        // // details.push(dc);
        // const records = await User.find({ _id: { $in: docs.ar } })
        //   .select('firstName lastName')
        //   .exec();

        // details.push(records);
      });
      // console.log(...details);
    }
    const result = [...details];
    // console.log(result);
    return res.send({ success: true, data: result });
  } catch (err) {
    console.log(err);
    return next(new RequestError(RequestErrorType.BAD_REQUEST, err));
  }
};