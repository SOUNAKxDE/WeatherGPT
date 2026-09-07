import os

from nlp_model import BasicAssistant

assistant = BasicAssistant('intents.json', model_name='models\\nlp_model')

if os.path.exists('models\\nlp_model.keras'):
    assistant.load_model()
else:
    assistant.fit_model(epochs=500)
    assistant.save_model()

done = False

while not done:
    message = input("Enter a message: ")
    if message == "STOP":
        done = True
    else:
        print(assistant.process_input(message))