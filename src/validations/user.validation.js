import { z } from 'zod';

export const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ invalid_type_error: 'ID user harus berupa angka' })
      .int('ID user harus berupa bilangan bulat')
      .positive('ID user harus lebih besar dari 0'),
  }),
  body: z.object({
    role_id: z
      .number({
        required_error: 'role_id wajib diisi',
        invalid_type_error: 'role_id harus berupa angka',
      })
      .int('role_id harus berupa bilangan bulat')
      .positive('role_id tidak valid'),
  }),
});