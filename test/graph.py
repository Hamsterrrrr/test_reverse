from graphviz import Digraph
import re

with open('payloadpy.js', 'r') as f:
    payload_code = f.read()

called_functions = re.findall(r'(\w+)\(', payload_code)

dependency_graph = Digraph(comment='Dependency Graph')
dependency_graph.node('main', 'main') 

for func in set(called_functions):
    dependency_graph.node(func, func)
    dependency_graph.edge('main', func)

dependency_graph.render('dependencies.gv', format='png')
print("Dependency Graph сохранён как dependencies.gv.png")

cfg_graph = Digraph(comment='Control Flow Graph')

steps = ['Start'] + called_functions + ['End']

for i in range(len(steps) - 1):
    cfg_graph.edge(steps[i], steps[i + 1])


cfg_graph.render('cfg.gv', format='png')
print("Control Flow Graph сохранён как cfg.gv.png")

