import { arraySchema } from './create-user-rule';
import { roleAddSchema } from './create-role-rule';
import { permissionAddSchema } from './create-permission-rule';
import { documentAddSchema } from './create-document-rule';
import { shelfAddSchema } from './create-shelf-rule';

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
};
