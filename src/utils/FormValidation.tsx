// フォーム入力の共通のバリデーション処理

export const validateMail = () => {
  return {
    required: {
      value: true,
      message: "入力が必須の項目です。",
    },
    pattern: {
      value: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/,
      message: "メールアドレスの形式が不正です",
    },
  };
};

export const validateUserName = () => {
  return {
    required: {
      value: true,
      message: "入力が必須の項目です。",
    },
    maxLength: {
      value: 50,
      message: "50字以内で入力してください。",
    },
  };
};

export const validatePass = () => {
  return {
    required: {
      value: true,
      message: "入力が必須の項目です。",
    },
    minLength: {
      value: 6,
      message: "6字以上で入力してください。",
    },
    maxLength: {
      value: 50,
      message: "50字以内で入力してください。",
    },
  };
};

export const validateOneMorePass = (pass: string) => {
  return {
    required: {
      value: true,
      message: "入力が必須の項目です。",
    },
    validate: (value: string) => value === pass || "パスワードが一致しません",
  };
};

export const validateContent = () => {
  return {
    required: {
      value: true,
      message: "ご利用規約に同意していただけなければ登録できません。",
    },
  };
};
