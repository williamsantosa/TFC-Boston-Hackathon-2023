import os

import openai
from flask import Flask, redirect, render_template, request, url_for

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")


@app.route("/", methods=("GET", "POST"))
def index():
    # print("=========================================")
    # print(openai.api_key)
    if request.method == "POST":
        # animal = request.form["animal"]
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt="DAVID MALAN: All right, this is CS50.\nAnd this is Week 3 already, wherein we'll take a look back actually\nat Week 0 where we first began.\nAnd in Week 0, recall that everything was very intuitive, in a sense.\nWe talked not just about representation of information, but algorithms.\nAnd we talked about tearing a phone book again and again.\nAnd that somehow got us to a better solution.\nBut today, we'll try to start formalizing some of those ideas\nand capturing some of those same ideas not in pseudocode just\nyet, but in actual code as well.\nBut we'll also consider the efficiency of those algorithms,\nlike just how good, how well-designed our algorithms actually are.\nAnd if you recall, when we did the phone book example\nwherein I first had an algorithm searching one page at a time,\nand then second one two pages at a time, and then third,\nstarted tearing the thing in half, recall\nthat we, with a wave of the hand, kind of analyzed it as follows.\nWe proposed that if the x-axis here is the size of the problem,\nlike number of pages in a phone book, and the y-axis is the time required\nto solve the problem in seconds, minutes,\npage tears, whatever your unit of measure is,\nrecall that the first algorithm, which is the straight line such that if you\nhad n pages in the phone book, it might have this slope of n--\nand there's this one-to-one relationship between pages and tears.\nTwo pages at a time, of course, was twice as fast, but still really\nthe same shape, the yellow line here indicating that yeah,\nit's n over 2, maybe plus 1 if you have to double back, as we discussed.\nBut it's really still fundamentally the same algorithm one\nor two pages at a time.\nBut the third algorithm, recall, was this one here in green,\nwhere we called it logarithmic in terms of how fast or how slow it was.\nAnd it was logarithmic because if the phone book was n pages\nlong, it only required, say, log n tears.\nAnd so this kind of line here that's curved,\nit's not a straight line anymore.\nAnd so this is the kind of algorithm that we're interested in today.\nSomething that's fundamentally faster than the first two algorithms\nwe discussed in Week 0.",
            temperature=0.7,
            max_tokens=256,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        print(response)
        return redirect(url_for("index", result=response.choices[0].text))

    result = request.args.get("result")
    return render_template("index.html", result=result)


def generate_prompt(animal):
    return """Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: {}
Names:""".format(animal.capitalize())
