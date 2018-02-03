# form-validator
这是一个form表单验证器，基于jquery

# usage
```
$('#some-form').formValidator();
```

#基本使用说明
## 最基本的demo
```
<form>
<div class='field-item'><input class='need-validate'><div class='error'></div></div>
<button type='submit'>
</form>

- 你所有的需要验证的字段必须要加上class='need-validate'
- 所有字段必要要一个包裹在class='field-item'的区域里面
- 所有字段都需要一个错误显示的区域, 且class为error,展示error的信息
```
## 必填demo
```
<form>
<div class='field-item'><input class='need-validate required'><div class='error'></div></div>
<button type='submit'>
</form>

- class required
```
## 数字
```
<form>
<div class='field-item'><input class='need-validate number'><div class='error'></div></div>
<button type='submit'>
</form>

- class number
```
## email
```
<form>
<div class='field-item'><input class='need-validate email'><div class='error'></div></div>
<button type='submit'>
</form>

- class number
```
## 正则

```
<form>
<div class='field-item'><input class='need-validate match' data-pattern='\d+'><div class='error'></div></div>
<button type='submit'>
</form>

- class number
- data-pattern里面填写正则表达式
```
#事件
```
var events = {
    // 在init之前触发，由form元素触发
    beforeInit : 'beforeInit',
    // 在init之后触发，由form元素触发
    afterInit : 'afterInit',
    // 验证的时候触发，由form触发
    beforeValidate : 'beforeValidate',
    afterValidate : 'afterValidate',
    // 系统使用
    validateField : 'validate.field',
    // 单个字段验证的时候触发，由具体的字段触发
    beforeValidateField : 'beforeValidateField',
    afterValidateField : 'afterValidateField'
};
```
# 高级使用
```
var params = {
    form_options : {
        // 配置需要验证的字段的选择器,默认class='need-validate'
        need_validate_selector : '.need-validate',
        // 配置每个字段的container的选择器
        field_item_selector : '.field-item',
        // 配置每个字段错误信息显示的选择器
        error_field_selector : '.error'
    },
    validator_key_selector_map : {
        // 配置必填字段的选择器
        required : '.required',
        // 配置数字的选择器
        number : '.number',
        // 配置email的选择器
        email : '.email',
        // 配置需要匹配正则的选择器
        match : '.match'
    },
    // 自定义验证器
    field_validator : {
        // 配置必填字段的回调验证
        required : function(event) {
            console.log(event, $(this));
        },
        number : function() {},
        email : function() {},
        match : function() {}
    }
};
$('#some-form').formValidator(params);
```

