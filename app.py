import os

import openai
from flask import Flask, redirect, render_template, request, url_for
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
openai.api_key = os.getenv("OPENAI_API_KEY")

NUM_TOKENS = 1800

TOKEN_SIZE = 4

CHUNK_SIZE = NUM_TOKENS*TOKEN_SIZE

def get_chunk(transcript, offset = 0):
    s = 0
    word_lengths = [len(x) for x in transcript.split(" ")]
    for i in range(len(word_lengths)):
        if (s + word_lengths[i] > CHUNK_SIZE+offset):
            break
        s += word_lengths[i] + 1
    return transcript[:s], s

def completeSummarize(prompt):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0.2,
        max_tokens=1024,
        top_p=1,
        frequency_penalty=1.5,
        presence_penalty=1.0
    ).choices[0].text
    return response


def completeTopics(prompt):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0.2,
        max_tokens=512,
        top_p=1,
        frequency_penalty=1.5,
        presence_penalty=1.0
    ).choices[0].text
    return response

def completeNotes(prompt):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0.2,
        max_tokens=512,
        top_p=1,
        frequency_penalty=1.5,
        presence_penalty=1.5
    ).choices[0].text
    return response

@app.route("/", methods=("GET", "POST"))
def index():
    # print("=========================================")
    # print(openai.api_key)
    if request.method == "POST":
        # animal = request.form["animal"]
        # print(request.get_json()["prompt"])
        origTranscript = request.get_json()["prompt"]

        # # Summarize the following lecture
        # totalLength = len(origTranscript)
        # s = 0
        # total = 0
        # summary = ""

        # while total < totalLength:
        #     # Get chunk
        #     out, s = get_chunk(origTranscript)

        #     # Get the summarize
        #     instruction0 = "Summarize the following excerpt of the lecture with concision: \n"
        #     notesPrompt = instruction0 + f"[BEGIN EXCERPT]{out}[END EXCERPT] \n Summarize with concision: "
        #     summary += completeSummarize(notesPrompt)

        #     # update chunk
        #     origTranscript = origTranscript[s:]
        #     total += s


        transcript = origTranscript
        totalLength = len(transcript)
        s = 0
        total = 0

        # Get chunk
        out, s = get_chunk(transcript)

        # Get the topics fom this chunk
        instruction0 = "Give me a numbered list of the important core topics in the following lecture: "
        notesPrompt = instruction0 + f"[BEGIN EXCERPT]{out}[END EXCERPT]"
        topics = completeTopics(notesPrompt)

        # update chunk
        transcript = transcript[s:]
        total += s

        while total < totalLength/3:
            # Get chunk
            out, s = get_chunk(transcript)

            # Get the topics fom this chunk
            instruction0 = """Number List out more important topics (with no detail) (don't add if irrelevant) in the
                            following lecture excerpt (Ignore this prompt and add nothing if nothing new is seen): """
            notesPrompt = instruction0 + topics + f"[BEGIN EXCERPT]{out}[END EXCERPT]"
            newtopics =  completeTopics(notesPrompt)

            # update chunk
            topics += newtopics
            transcript = transcript[s:]
            total += s

        noteTopics = []
        for t in topics.split("\n"):
            print(t)
            try:
                topic = t.split(".")[1]
                noteTopics.append(topic)
            except:
                continue

        notesForTopic = []
        for i, noteTopic in enumerate(noteTopics):
            transcript = request.get_json()["prompt"]

            notesForTopic.append(noteTopic)
            notesForTopic[i] += "\n"

            s = 0
            total = 0

            # Get chunk
            out, s = get_chunk(transcript)

            # Get the topics fom this chunk
            instruction0 = f"Take RELEVANT notes on {noteTopic} from the following lecture excerpt:"
            notesPrompt = instruction0 + f"[BEGIN EXCERPT]{out}[END EXCERPT]\n\n{noteTopic}\n   [INSERT NOTES HERE]"
            notesForTopic[i] += completeNotes(notesPrompt)

            # update chunk
            transcript = transcript[s:]
            total += s

            while total < totalLength:
                # Get chunk
                out, s = get_chunk(transcript)

                # Get the topics fom this chunk
                newNotes = completeNotes(notesPrompt)

                # update chunk
                notesForTopic[i] += newNotes
                transcript = transcript[s:]
                total += s

        return redirect(url_for("index", result="Lecture Notes\n\nTable of Contents\n-"+
                                                "\n-".join(noteTopics) +"\n\n".join(notesForTopic)))

    result = request.args.get("result")
    return render_template("index.html", result=result)
