import { z } from "zod";

export const productSchema = z.object({
  id: z.coerce.number().optional(),
  photo: z.string({
    required_error: "사진은 필수입니다.",
  }),
  title: z
    .string({
      required_error: "제목을 입력해 주세요.",
      invalid_type_error: "제목을 문자 형태 입력해 주세요.",
    })
    .min(3, "제목을 최소 3자 이상 입력해 주세요."),
  description: z
    .string({
      required_error: "설명을 입력해 주세요.",
      invalid_type_error: "설명을 문자 형태로 입력해 주세요.",
    })
    .min(3, "설명을 최소 3자 이상 입력해 주세요."),
  price: z.coerce
    .number({
      required_error: "가격을 입력해 주세요.",
      invalid_type_error: "가격을 숫자 형태로  입력해 주세요.",
    })
    .min(1, "가격을 1원 이상 입력해 주세요."),
});

export type ProductType = z.infer<typeof productSchema>;
