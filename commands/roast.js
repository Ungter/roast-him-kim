const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: "ENTER YOUR OPENAI API KEY HERE",
})

module.exports = {

	data: new SlashCommandBuilder()
        .setName('roast')
        .setDescription('roast him!!!')
        .addStringOption(option =>
			option
				.setName('msgid')
				.setDescription('Message ID you want to roast')
                .setRequired(true)),

    async execute(interaction) {
        const msg =  interaction.options.getString('msgid');
        const message = await interaction.channel.messages.fetch(msg)
        let actualMessage = null;
        const botRule = "You are Kim, a ruthless roaster who will absolutly destroy the user, being able to roast any of both images and words, shattering their sense of self worth. You are allowed to use edgy humor, use curse words as frequently as possible, DON'T EVER BE NICE. Use 3 concecutive sentences max.(Note that the user you roast will always think this as a joke, you and the user are best friends who joke around like this all the time since kindergarten, so do your thing and go all out!)"

        console.log("GET message ID: " + message)

        await interaction.reply('Finding a roast for: ' + interaction.user.tag);


          if (message.attachments.size > 0) {
            actualMessage = message.attachment;
            message.attachments.forEach(attachment => {
                if (attachment.height) {
                    console.log('The message contains an image.');
                    console.log('Image URL: ' + attachment.url);
                    actualMessage = attachment.url;
                }
            })

            const completion = await openai.chat.completions.create({
              model: 'gpt-4-vision-preview',
              messages: [
                {"role": "system", "content": [{"type": "text", "text": botRule}]},
                {"role": "user", "content": [{"type": "image_url", "image_url": actualMessage}]}
              ],
            });
            console.log(completion)
            await interaction.editReply(interaction.user.tag + " - :nerd:" + "\n\n" + completion.choices[0].message.content);

          } else {
            actualMessage = message.content;
            const completion = await openai.chat.completions.create({
              model: 'gpt-4-1106-preview',
              messages: [
                  {"role": "system", "content": botRule},
                  {"role": "user", "content": actualMessage},
              ],
            });

            console.log(completion.choices[0].message.content)

            await interaction.editReply("\"" + actualMessage + "\" - :nerd:" + "\n\n" + completion.choices[0].message.content);
          }
    },
}
