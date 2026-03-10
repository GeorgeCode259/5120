from flask_wtf import FlaskForm
from wtforms import IntegerField, SelectField, StringField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, Length, NumberRange, Optional


class ProductForm(FlaskForm):
    name = StringField("Product name", validators=[DataRequired(), Length(max=200)])
    brand = StringField("Brand", validators=[Optional(), Length(max=120)])
    spf = IntegerField("SPF", validators=[Optional(), NumberRange(min=1, max=100)])
    pa = StringField("PA", validators=[Optional(), Length(max=10)])
    kind = StringField("Type", validators=[Optional(), Length(max=50)])
    description = TextAreaField("Description", validators=[Optional(), Length(max=5000)])
    submit = SubmitField("Save")


class ReviewForm(FlaskForm):
    rating = SelectField(
        "Rating",
        choices=[("5", "5 - Excellent"), ("4", "4"), ("3", "3"), ("2", "2"), ("1", "1 - Poor")],
        validators=[DataRequired()],
    )
    body = TextAreaField("Comment", validators=[Optional(), Length(max=5000)])
    submit = SubmitField("Post review")

