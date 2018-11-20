import { arraySchema } from './create-user-rule';
import { roleAddSchema } from './create-role-rule';
import { permissionAddSchema } from './create-permission-rule';
import { documentAddSchema } from './create-document-rule';
import { shelfAddSchema } from './create-shelf-rule';
import { caseAddSchema } from './create-case-rule';
import { holidayAddSchema } from './create-holiday-rule';
import { leaveTypeAddSchema } from './create-leavetype-rule';
import { leaveAddSchema } from './create-leave-rule';
import { docTypeAddSchema } from './create-doctype-rule';
import { departmentAddSchema } from './create-department-rule';

export const schemaRules: any = {
  'user-save': { opn: { allowUnknown: true }, schema: arraySchema },
  'role-save': { opn: { allowUnknown: true }, schema: roleAddSchema },
  'permission-save': {
    opn: { allowUnknown: true },
    schema: permissionAddSchema,
  },
  'document-save': { opn: { allowUnknown: true }, schema: documentAddSchema },
  'shelf-save': {
    opn: { allowUnknown: true },
    schema: shelfAddSchema,
  },
  'casedetails-save': { opn: { allowUnknown: true }, schema: caseAddSchema },
  'holiday-save': { opn: { allowUnknown: true }, schema: holidayAddSchema },
  'leavetype-save': { opn: { allowUnknown: true }, schema: leaveTypeAddSchema },
  'leave-save': { opn: { allowUnknown: true }, schema: leaveAddSchema },
  'doctype-save': { opn: { allowUnknown: true }, schema: docTypeAddSchema },
  'department-save': {
    opn: { allowUnknown: true },
    schema: departmentAddSchema,
  },
};
