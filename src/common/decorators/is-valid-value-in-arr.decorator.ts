import {
  registerDecorator, // 注册装饰器
  ValidationOptions, // 验证选项
  ValidationArguments, // 验证参数
} from 'class-validator';

/**
 * 该装饰器用于验证传入的值是否在预期的有效值数组中
 * @param validValues 预期的有效值数组
 * @param validationOptions 验证选项
 * @returns 装饰器函数
 */
export function IsValidValueInArr(
  validValues: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    // 注册装饰器
    registerDecorator({
      name: 'IsValidValueInArr', // 装饰器的名称
      target: object.constructor, // 装饰器的目标对象
      propertyName: propertyName, // 被装饰的属性名
      constraints: [validValues], // 约束条件
      options: validationOptions, // 验证选项
      validator: {
        // 验证函数
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          // 遍历对象的每个属性，检查其值是否在预期的有效值数组中
          for (const key in value) {
            if (!relatedPropertyName.includes(value[key])) {
              return false; // 如果不在，返回 false
            }
          }
          return true; // 所有属性的值都在预期的有效值数组中，返回 true
        },
        // 默认的错误消息
        defaultMessage(args: ValidationArguments) {
          return `动态属性${args.property}，必须在传入的数组${args.constraints}`;
        },
      },
    });
  };
}
