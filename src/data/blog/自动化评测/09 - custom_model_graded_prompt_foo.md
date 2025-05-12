---
title: anthropics的prompt评测教程9：promptfoo的自定义模型评分评估
date: 2025-05-11T09:00:00
pubDatetime: 2025-05-11T09:00:00
description: 翻译自：anthropics/courses/prompt_evaluations/09_custom_model_graded_prompt_foo
summary: 翻译自：anthropics/courses/prompt_evaluations/09_custom_model_graded_prompt_foo
tags: ["搬运","anthropics的prompt评测教程"]
---

> 特别注意：本文搬运自 github 项目 [anthropics/courses/prompt_evaluations](https://github.com/anthropics/courses/tree/master/prompt_evaluations) ，经过中文翻译，内容可能因为转译有少数表达上的改动，但不影响主要逻辑，仅供个人阅读学习使用


# 自定义模型评分评估

**注意：本课程位于包含相关代码文件的文件夹中。如果您想跟上进度并自行运行评估，请下载整个文件夹**

在本课中，我们将学习如何使用 promptfoo 编写自定义模型评分评估。我们将从一个简单的提示目标开始：我们希望编写一个提示，能够将长篇、技术性复杂的维基百科文章转化为适合小学生阅读的简短摘要。

例如，给定整个 [维基百科关于卷积神经网络的条目](https://en.wikipedia.org/wiki/Convolutional_neural_network) ，我们希望得到类似以下的简单输出摘要：

> 卷积神经网络，或 CNN，是一种特殊的计算机程序，可以学习识别图像和模式。它们的工作方式有点像人脑，使用层叠的人工“神经元”来处理信息。  
> 卷积神经网络在识别图片中的物体或识别面部特征方面非常出色。它们通过将图像分解成更小的部分并寻找重要特征来实现这一点，有点像拼图。  
> CNN 之所以特别，是因为它们可以通过查看大量示例来自动学习这些特征。这使得它们在识别事物方面越来越擅长，有时甚至可以达到人类水平的性能。  
> 科学家和工程师使用 CNN 来处理各种酷炫的应用，比如帮助自动驾驶汽车看清道路、发现新药物，甚至教计算机下棋和围棋这类游戏。

为了评估我们提示词的有效性，我们将编写一个自定义的模型评分断言，该断言将根据三个指标来评估生成的摘要：

- 简洁性（1-5）- 摘要是否尽可能简洁？
- 准确性（1-5）- 摘要是否完全基于初始文章准确？
- 语气（1-5）- 摘要是否适合没有技术培训的小学生？

这些指标中的每一个都将产生一个1到5之间的分数。我们将它们平均起来，目标是平均分至少达到4.5/5。为此，我们将定义一个自定义的模型评分函数！

---

## 输入数据

我们的目标是编写一个提示，将复杂的维基百科文章总结成简短易懂的摘要。我们将从收集我们想要总结的文章开始作为我们的评估。

在这个文件夹中，我们提供了一个 `articles` 目录，其中包含八个不同的 txt 文件。每个文件包含一个维基百科文章的文本内容。我们将使用这些文章作为我们评估的输入。看看一些文章文件，以了解它们的长度和复杂性。

该数据集仅包含八个测试用例，这对于现实世界的评估来说太小了。正如我们在整个课程中多次提到的，我们强烈建议使用至少包含100个条目的评估数据集。

---

## 我们的提示

查看 `prompts.py` 文件。它包含三个不同的提示生成函数，我们将使用 promptfoo 来评估它们：

```py
def basic_summarize(article):
  return f"Summarize this article {article}"

def better_summarize(article):
  return f"""
  Summarize this article for a grade-school audience: {article}"""

def best_summarize(article):
  return f"""
  You are tasked with summarizing long wikipedia articles for a grade-school audience.
  Write a short summary, keeping it as concise as possible. 
  The summary is intended for a non-technical, grade-school audience. 
  This is the article: {article}"""
```

**需要注意的是，这些提示通常都不够好。我们故意将提示保持简短，并且没有遵循最佳实践，例如添加全面的示例，以尽量减少在运行此评估集时使用的 token 数量。**

---

## 更新配置文件

提示：``promptfooconfig.yaml`` 文件包含我们之前大多见过的字段：

```yaml
description: 'Summarization Evaluation'

prompts:
  - prompts.py:basic_summarize
  - prompts.py:better_summarize
  - prompts.py:best_summarize

providers:
  - id: anthropic:messages:claude-3-5-sonnet-20240620
    label: "3.5 Sonnet"

tests:
  - vars:
      article: file://articles/article1.txt
  - vars:
      article: file://articles/article2.txt
  - vars:
      article: file://articles/article3.txt
  - vars:
      article: file://articles/article4.txt
  - vars:
      article: file://articles/article5.txt
  - vars:
      article: file://articles/article6.txt
  - vars:
      article: file://articles/article7.txt
  - vars:
      article: file://articles/article8.txt

defaultTest:
  assert:
    - type: python
      value: file://custom_llm_eval.py
```

我们正在告诉 promptfoo 我们想要使用在 `prompts.py` 中定义的三个提示。接下来，我们配置 promptfoo 使用 Claude 3.5 Sonnet 作为提供者。

我们正在编写一系列  `测试` ，在每个测试中我们为 `article` 提供不同的值。这里的新内容是，我们从文本文件中加载这些值。文章太长，将它们直接放在 YAML 文件中并不合适。例如，配置文件中的这一部分：

```yaml
tests:
  - vars:
      article: file://articles/article1.txt
```

告诉 promptfoo 我们想要运行一个测试，其中 `article` 变量被设置为 `article1.txt` 文件中的文本内容。我们对所有八个文章文件重复此过程。

---

## 编写自定义模型评分函数

接下来，让我们将注意力转向 YAML 文件中的最后一个字段：

```yaml
defaultTest:
  assert:
    - type: python
      value: file://custom_llm_eval.py
```

这个字段告诉 promptfoo，对于每一个单独的测试，我们都想运行文件 `custom_llm_eval.py` 中定义的特定 Python 断言。我们之前见过这种语法，当时是在定义自定义代码评分断言。唯一的不同之处在于，这次我们将编写一个函数，使用另一个模型来评分模型的输出。

让我们看一下 `custom_llm_eval.py` 文件的内容。它包含了不少代码：

```py
import anthropic
import os
import json

def llm_eval(summary, article):
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    prompt = f"""Evaluate the following summary based on these criteria:
    1. Conciseness (1-5) - is the summary as concise as possible?
        - Conciseness of 1: The summary is unnecessarily long, including excessive details, repetitions, or irrelevant information. It fails to distill the key points effectively.
        - Conciseness of 3:  The summary captures most key points but could be more focused. It may include some unnecessary details or slightly over explain certain concepts.
        - Conciseness of 5: The summary effectively condenses the main ideas into a brief, focused text. It includes all essential information without any superfluous details or explanations.
    2. Accuracy (1-5) - is the summary completely accurate based on the initial article'?
        - Accuracy of 1: The summary contains significant errors, misrepresentations, or omissions that fundamentally alter the meaning or key points of the original article.
        - Accuracy of 3:  The summary captures some key points correctly but may have minor inaccuracies or omissions. The overall message is generally correct, but some details may be wrong.
        - Accuracy of 5: The summary faithfully represents the main gist of the original article without any errors or misinterpretations. All included information is correct and aligns with the source material.
    3. Tone (1-5) - is the summary appropriate for a grade school student with no technical training?
        - Tone of 1: The summary uses language or concepts that are too complex, technical, or mature for a grade school audience. It may contain jargon, advanced terminology, or themes that are not suitable for young readers.
        - Tone of 2:  The summary mostly uses language suitable for grade school students but occasionally includes terms or concepts that may be challenging. Some explanations might be needed for full comprehension.
        - Tone of 3: The summary consistently uses simple, clear language that is easily understandable by grade school students. It explains complex ideas in a way that is accessible and engaging for young readers.
    4. Explanation - a general description of the way the summary is evaluated

    <examples>
    <example>
    This summary:
    <summary>
    Artificial neural networks are computer systems inspired by how the human brain works. They are made up of interconnected "neurons" that process information. These networks can learn to do tasks by looking at lots of examples, similar to how humans learn. 

    Some key things about neural networks:
    - They can recognize patterns and make predictions
    - They improve with more data and practice
    - They're used for things like identifying objects in images, translating languages, and playing games

    Neural networks are a powerful tool in artificial intelligence and are behind many of the "smart" technologies we use today. While they can do amazing things, they still aren't as complex or capable as the human brain.
    <summary>
    Should receive a 5 for tone, a 5 for accuracy, and a 5 for conciseness
    </example>

    <example>
    This summary:
    <summary>
    Here is a summary of the key points from the article on artificial neural networks (ANNs):

    1. ANNs are computational models inspired by biological neural networks in animal brains. They consist of interconnected artificial neurons that process and transmit signals.

    2. Basic structure:
    - Input layer receives data
    - Hidden layers process information 
    - Output layer produces results
    - Neurons are connected by weighted edges

    3. Learning process:
    - ANNs learn by adjusting connection weights
    - Use techniques like backpropagation to minimize errors
    - Can perform supervised, unsupervised, and reinforcement learning

    4. Key developments:
    - Convolutional neural networks (CNNs) for image processing
    - Recurrent neural networks (RNNs) for sequential data
    - Deep learning with many hidden layers

    5. Applications:
    - Pattern recognition, classification, regression
    - Computer vision, speech recognition, natural language processing
    - Game playing, robotics, financial modeling

    6. Advantages:
    - Can model complex non-linear relationships
    - Ability to learn and generalize from data
    - Adaptable to many different types of problems

    7. Challenges:
    - Require large amounts of training data
    - Can be computationally intensive
    - "Black box" nature can make interpretability difficult

    8. Recent advances:
    - Improved hardware (GPUs) enabling deeper networks
    - New architectures like transformers for language tasks
    - Progress in areas like generative AI

    The article provides a comprehensive overview of ANN concepts, history, types, applications, and ongoing research areas in this field of artificial intelligence and machine learning.
    </summary>
    Should receive a 1 for tone, a 5 for accuracy, and a 3 for conciseness
    </example>
    </examples>

    Provide a score for each criterion in JSON format. Here is the format you should follow always:

    <json>
    {{
    "conciseness": <number>,
    "accuracy": <number>,
    "tone": <number>,
    "explanation": <string>,
    }}
    </json>


    Original Text: <original_article>{article}</original_article>
    
    Summary to Evaluate: <summary>{summary}</summary>
    """
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=1000,
        temperature=0,
        messages=[
            {
                "role": "user",
                "content": prompt
            },
            {
                "role": "assistant",
                "content": "<json>" 
            }
        ],
        stop_sequences=["</json>"]
    )
    
    evaluation = json.loads(response.content[0].text)
    # Filter out non-numeric values and calculate the average
    numeric_values = [value for key, value in evaluation.items() if isinstance(value, (int, float))]
    avg_score = sum(numeric_values) / len(numeric_values)
    return avg_score, response.content[0].text

def get_assert(output: str, context, threshold=4.5):
    article = context['vars']['article']
    score, evaluation = llm_eval(output, article )
    return {
        "pass": score >= threshold,
        "score": score,
        "reason": evaluation
    }
```

### `get_assert()`[](http://localhost:8888/lab/tree/Users/wuyiwai/code/github/anthropics_courses/prompt_evaluations/09_custom_model_graded_prompt_foo/lesson.ipynb#get_assert\(\))

这里有很多可以讨论的内容，但让我们从文件底部的函数开始：`get_assert`

```py
def get_assert(output: str, context, threshold=4.5):
    article = context['vars']['article']
    score, evaluation = llm_eval(output, article )
    return {
        "pass": score >= threshold,
        "score": score,
        "reason": evaluation
    }
```

回顾我们之前的课程，promptfoo 会自动在断言文件中查找名为 `get_assert` 的函数。它会将以下两个参数传递给该函数：

- 某个模型响应的  `输出`
- 包含生成输出的变量和提示的`上下文`字典

Promptfoo 期望我们的函数返回以下之一：

- 一个布尔值（通过/失败）
- 一个浮点数（分数）
- 一个评分结果字典

我们选择返回一个评分结果字典，该字典必须包含以下属性：

- `pass`: 布尔值
- `score`: 浮点数
- `reason`: 一个字符串解释

这是对函数的注释版本，解释了其中发生的事情：

```py
def get_assert(output: str, context, threshold=4.5):
    # Get the specific article from the context
    article = context['vars']['article']
    #Pass the model output and the article to a function we've defined called llm_eval
    score, evaluation = llm_eval(output, article ) #capture the resulting score it returns and the evaluation explanation
    #return a dictionary indicating whether the output passed the test, its score, and the explanation behind the score
    return {
        "pass": score >= threshold,
        "score": score,
        "reason": evaluation
    }
```

### `llm_eval()`[](http://localhost:8888/lab/tree/Users/wuyiwai/code/github/anthropics_courses/prompt_evaluations/09_custom_model_graded_prompt_foo/lesson.ipynb#llm_eval\(\))

接下来，让我们更详细地了解一下实际进行评分的 `llm_eval` 函数。该函数执行以下操作：

1. 定义一个非常长的评分标准提示，该提示解释了摘要应该如何评分
2. 通过向 Anthropic API 发送请求来运行评分提示
3. 解析响应并计算平均分数
4. 返回平均分数和模型的完整文本响应

以下是全部代码：

```py
def llm_eval(summary, article):
    """
    Evaluate summary using an LLM (Claude).
    
    Args:
    summary (str): The summary to evaluate.
    article (str): The original text that was summarized.
    
    Returns:
    bool: True if the average score is above the threshold, False otherwise.
    """
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    prompt = f"""Evaluate the following summary based on these criteria:
    1. Conciseness (1-5) - is the summary as concise as possible?
        - Conciseness of 1: The summary is unnecessarily long, including excessive details, repetitions, or irrelevant information. It fails to distill the key points effectively.
        - Conciseness of 3:  The summary captures most key points but could be more focused. It may include some unnecessary details or slightly overexplain certain concepts.
        - Conciseness of 5: The summary effectively condenses the main ideas into a brief, focused text. It includes all essential information without any superfluous details or explanations.
    2. Accuracy (1-5) - is the summary completely accurate based on the initial article'?
        - Accuracy of 1: The summary contains significant errors, misrepresentations, or omissions that fundamentally alter the meaning or key points of the original article.
        - Accuracy of 3:  The summary captures some key points correctly but may have minor inaccuracies or omissions. The overall message is generally correct, but some details may be wrong.
        - Accuracy of 5: The summary faithfully represents the main gist of the original article without any errors or misinterpretations. All included information is correct and aligns with the source material.
    3. Tone (1-5) - is the summary appropriate for a grade school student with no technical training?
        - Tone of 1: The summary uses language or concepts that are too complex, technical, or mature for a grade school audience. It may contain jargon, advanced terminology, or themes that are not suitable for young readers.
        - Tone of 2:  The summary mostly uses language suitable for grade school students but occasionally includes terms or concepts that may be challenging. Some explanations might be needed for full comprehension.
        - Tone of 3: The summary consistently uses simple, clear language that is easily understandable by grade school students. It explains complex ideas in a way that is accessible and engaging for young readers.
    4. Explanation - a general description of the way the summary is evaluated

    <examples>
    <example>
    This summary:
    <summary>
    Artificial neural networks are computer systems inspired by how the human brain works. They are made up of interconnected "neurons" that process information. These networks can learn to do tasks by looking at lots of examples, similar to how humans learn. 

    Some key things about neural networks:
    - They can recognize patterns and make predictions
    - They improve with more data and practice
    - They're used for things like identifying objects in images, translating languages, and playing games

    Neural networks are a powerful tool in artificial intelligence and are behind many of the "smart" technologies we use today. While they can do amazing things, they still aren't as complex or capable as the human brain.
    <summary>
    Should receive a 5 for tone, a 5 for accuracy, and a 5 for conciseness
    </example>

    <example>
    This summary:
    <summary>
    Here is a summary of the key points from the article on artificial neural networks (ANNs):

    1. ANNs are computational models inspired by biological neural networks in animal brains. They consist of interconnected artificial neurons that process and transmit signals.

    2. Basic structure:
    - Input layer receives data
    - Hidden layers process information 
    - Output layer produces results
    - Neurons are connected by weighted edges

    3. Learning process:
    - ANNs learn by adjusting connection weights
    - Use techniques like backpropagation to minimize errors
    - Can perform supervised, unsupervised, and reinforcement learning

    4. Key developments:
    - Convolutional neural networks (CNNs) for image processing
    - Recurrent neural networks (RNNs) for sequential data
    - Deep learning with many hidden layers

    5. Applications:
    - Pattern recognition, classification, regression
    - Computer vision, speech recognition, natural language processing
    - Game playing, robotics, financial modeling

    6. Advantages:
    - Can model complex non-linear relationships
    - Ability to learn and generalize from data
    - Adaptable to many different types of problems

    7. Challenges:
    - Require large amounts of training data
    - Can be computationally intensive
    - "Black box" nature can make interpretability difficult

    8. Recent advances:
    - Improved hardware (GPUs) enabling deeper networks
    - New architectures like transformers for language tasks
    - Progress in areas like generative AI

    The article provides a comprehensive overview of ANN concepts, history, types, applications, and ongoing research areas in this field of artificial intelligence and machine learning.
    </summary>
    Should receive a 1 for tone, a 5 for accuracy, and a 3 for conciseness
    </example>
    </examples>

    Provide a score for each criterion in JSON format. Here is the format you should follow always:

    <json>
    {{
    "conciseness": <number>,
    "accuracy": <number>,
    "tone": <number>,
    "explanation": <string>,
    }}
    </json>


    Original Text: <original_article>{article}</original_article>
    
    Summary to Evaluate: <summary>{summary}</summary>
    """
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=1000,
        temperature=0,
        messages=[
            {
                "role": "user",
                "content": prompt
            },
            {
                "role": "assistant",
                "content": "<json>" 
            }
        ],
        stop_sequences=["</json>"]
    )
    
    evaluation = json.loads(response.content[0].text)
    # Filter out non-numeric values and calculate the average
    numeric_values = [value for key, value in evaluation.items() if isinstance(value, (int, float))]
    avg_score = sum(numeric_values) / len(numeric_values)
    # Return the average score and the overall model response
    return avg_score, response.content[0].text
```

---

