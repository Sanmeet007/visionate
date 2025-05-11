import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import GraphicHeading from "../GraphicHeading";

const faqs = [
  {
    question: "What is Visionate and how does it work?",
    answer:
      "Visionate is a Chrome extension that uses AI to generate accurate, meaningful captions for images. When you upload or select an image, it's processed by a pretrained model running on a Flask + TensorFlow backend, and a caption is generated instantly.",
  },
  {
    question: "How many images can I caption with Visionate?",
    answer:
      "The number of images you can caption depends on your pricing tier. Free users have a limited quota per month, while premium users can caption significantly more or even unlimited images depending on their plan.",
  },
  {
    question: "Is Visionate suitable for all kinds of images?",
    answer:
      "Visionate performs best with images showing clear objects, scenes, people, or activities. It may produce less accurate results for abstract art, heavy edits, or low-resolution images.",
  },
  {
    question: "Is my data safe while using Visionate?",
    answer:
      "Absolutely. Visionate only uses your image to generate a caption and does not store or share any personal data. All image processing is secure and temporary.",
  },
  {
    question: "Can I use Visionate without an internet connection?",
    answer:
      "Currently, Visionate requires an active internet connection to communicate with the backend server for AI processing. Offline support may be introduced in future versions.",
  },
];

export default function FaqSection() {
  return (
    <>
      <GraphicHeading text="Frequently Asked Questions" />
      <Box component={"section"} sx={{ px: "2rem" }}>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="subtitle1" component="span">
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  );
}
