from reportlab.platypus.flowables import Flowable


class VerticalText(Flowable):
    """Rotates a text in a table cell."""

    def __init__(self, text, fn, fs):
        Flowable.__init__(self)
        self.text = text
        self.fn = fn
        self.fs = fs

    def draw(self):
        canvas = self.canv
        canvas.rotate(180)
        fs = self.fs

        canvas.translate(1, -fs / 1.2)  # canvas._leading?
        canvas.drawString(0, 0, self.text)

    def wrap(self, aW, aH):
        canv = self.canv
        # fn, fs = canv._fontname, canv._fontsize
        return canv._leading, 1 + canv.stringWidth(self.text, self.fn, self.fs)
