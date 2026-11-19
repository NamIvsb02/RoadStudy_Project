require('dotenv').config();
const { generateJson, describeConfig } = require('../src/config/ai');

const { provider, model, baseUrl, hasKey } = describeConfig();

console.log('Kiểm tra kết nối dịch vụ AI');
console.log(`  Nhà cung cấp : ${provider}`);
console.log(`  Địa chỉ      : ${baseUrl}`);
console.log(`  Model        : ${model}`);
console.log(`  Đã có API key: ${hasKey ? 'có' : 'KHÔNG'}\n`);

generateJson({
    system: 'Bạn là trợ lý. Chỉ trả về một đối tượng JSON.',
    prompt: 'Trả về JSON có đúng một trường "reply" là một lời chào ngắn bằng tiếng Việt.',
})
    .then((result) => {
        console.log('THÀNH CÔNG, AI trả về:', JSON.stringify(result));
        process.exitCode = 0;
    })
    .catch((err) => {
        console.log('THẤT BẠI:', err.message);
        process.exitCode = 1;
    });